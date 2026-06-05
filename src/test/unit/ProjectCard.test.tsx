/**
 * Unit tests for ProjectCard component
 * Validates: Requirements 7.2, 7.5, 7.6
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectCard } from '../../components/ui/ProjectCard'
import type { Project } from '../../types'

vi.mock('framer-motion', () => ({
  motion: {
    a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement> & { href?: string; target?: string; rel?: string; 'aria-label'?: string }) => <a {...props}>{children}</a>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const baseProject: Project = {
  id: 'test-project',
  name: 'Test Project',
  description: 'A test project description.',
  techStack: [
    { name: 'React', category: 'framework' },
    { name: 'TypeScript', category: 'language' },
    { name: 'Node.js', category: 'tool' },
  ],
  githubUrl: 'https://github.com/test/project',
  featured: false,
}

describe('ProjectCard', () => {
  describe('required fields rendering', () => {
    it('renders the project name', () => {
      render(<ProjectCard project={baseProject} />)
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    it('renders the project description', () => {
      render(<ProjectCard project={baseProject} />)
      expect(screen.getByText('A test project description.')).toBeInTheDocument()
    })

    it('renders all tech stack tags', () => {
      render(<ProjectCard project={baseProject} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })
  })

  describe('GitHub link', () => {
    it('renders a GitHub link', () => {
      render(<ProjectCard project={baseProject} />)
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toBeInTheDocument()
    })

    it('GitHub link opens in a new tab', () => {
      render(<ProjectCard project={baseProject} />)
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('GitHub link points to the correct URL', () => {
      render(<ProjectCard project={baseProject} />)
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/test/project')
    })
  })

  describe('live demo link', () => {
    it('does not render live demo link when liveUrl is undefined', () => {
      render(<ProjectCard project={baseProject} />)
      expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument()
    })

    it('renders live demo link when liveUrl is defined', () => {
      const projectWithLive: Project = {
        ...baseProject,
        liveUrl: 'https://example.com',
      }
      render(<ProjectCard project={projectWithLive} />)
      const liveLink = screen.getByRole('link', { name: /live demo/i })
      expect(liveLink).toBeInTheDocument()
      expect(liveLink).toHaveAttribute('href', 'https://example.com')
      expect(liveLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('featured variant', () => {
    it('shows "Featured Project" badge when featured is true', () => {
      render(<ProjectCard project={{ ...baseProject, featured: true }} featured />)
      expect(screen.getByText('Featured Project')).toBeInTheDocument()
    })

    it('does not show "Featured Project" badge when featured is false', () => {
      render(<ProjectCard project={baseProject} />)
      expect(screen.queryByText('Featured Project')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('tech stack list has accessible label', () => {
      render(<ProjectCard project={baseProject} />)
      expect(
        screen.getByRole('list', { name: /technologies used in test project/i }),
      ).toBeInTheDocument()
    })
  })
})
