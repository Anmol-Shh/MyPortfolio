/**
 * Property 5: ProjectCard renders all required fields
 * Tag: Feature: anmol-portfolio, Property 5: ProjectCard renders all required fields
 * Validates: Requirements 7.2, 7.6
 *
 * For any Project object with a name, description, techStack array, and githubUrl,
 * rendering ProjectCard must produce output containing all those values.
 */
import { describe, it, vi } from 'vitest'
import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { ProjectCard } from '../../components/ui/ProjectCard'
import type { Project, TechTag } from '../../types'

vi.mock('framer-motion', () => ({
  motion: {
    a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string; target?: string; rel?: string; 'aria-label'?: string }) => <a {...props}>{children}</a>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const nonEmptyString = fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0)

const techTagArbitrary: fc.Arbitrary<TechTag> = fc.record({
  name: nonEmptyString,
  category: fc.constantFrom<TechTag['category']>('language', 'framework', 'tool', 'cloud'),
})

const projectArbitrary: fc.Arbitrary<Project> = fc.record({
  id: nonEmptyString,
  name: nonEmptyString,
  description: nonEmptyString,
  techStack: fc.array(techTagArbitrary, { minLength: 1, maxLength: 10 }),
  githubUrl: fc.webUrl(),
  liveUrl: fc.option(fc.webUrl(), { nil: undefined }),
  featured: fc.boolean(),
})

describe('Property 5: ProjectCard renders all required fields', () => {
  it('rendered output contains project name', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const { container } = render(<ProjectCard project={project} />)
        return (container.textContent ?? '').includes(project.name)
      }),
      { numRuns: 100 },
    )
  })

  it('rendered output contains project description', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const { container } = render(<ProjectCard project={project} />)
        return (container.textContent ?? '').includes(project.description)
      }),
      { numRuns: 100 },
    )
  })

  it('rendered output contains every tech stack tag name', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const { container } = render(<ProjectCard project={project} />)
        const text = container.textContent ?? ''
        return project.techStack.every((tag) => text.includes(tag.name))
      }),
      { numRuns: 100 },
    )
  })

  it('rendered output contains the GitHub URL as an href attribute', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const { container } = render(<ProjectCard project={project} />)
        const links = container.querySelectorAll('a[href]')
        const hrefs = Array.from(links).map((a) => a.getAttribute('href') ?? '')
        return hrefs.some((href) => href === project.githubUrl)
      }),
      { numRuns: 100 },
    )
  })

  it('rendered output contains all required fields simultaneously', () => {
    fc.assert(
      fc.property(projectArbitrary, (project) => {
        const { container } = render(<ProjectCard project={project} />)
        const text = container.textContent ?? ''
        const links = container.querySelectorAll('a[href]')
        const hrefs = Array.from(links).map((a) => a.getAttribute('href') ?? '')

        return (
          text.includes(project.name) &&
          text.includes(project.description) &&
          project.techStack.every((tag) => text.includes(tag.name)) &&
          hrefs.some((href) => href === project.githubUrl)
        )
      }),
      { numRuns: 200 },
    )
  })
})
