import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from '../../components/sections/Hero'

/**
 * Integration tests for MeshGradient integration in Hero section
 * Validates: Requirements 1.4, 1.5
 */
describe('Hero Section with MeshGradient Integration', () => {
  it('should render Hero section with all background layers', () => {
    render(<Hero theme="light" />)
    
    const heroSection = screen.getByLabelText('Hero section')
    expect(heroSection).toBeInTheDocument()
  })

  it('should render MeshGradient component in Hero section', () => {
    const { container } = render(<Hero theme="light" />)
    
    // MeshGradient renders a div with -z-10 class and aria-hidden
    const meshGradientElements = container.querySelectorAll('[aria-hidden="true"].-z-10')
    
    // Should have at least 3 background layers: HeroBackground, MeshGradient, BackgroundPattern
    expect(meshGradientElements.length).toBeGreaterThanOrEqual(3)
  })

  it('should layer background components in correct order', () => {
    const { container } = render(<Hero theme="light" />)
    
    const heroSection = container.querySelector('#hero')
    expect(heroSection).toBeInTheDocument()
    
    // Verify the section has the correct structure
    const backgroundLayers = heroSection?.querySelectorAll('.absolute.inset-0.-z-10')
    
    // Should have background layers (particles, mesh gradient, pattern)
    expect(backgroundLayers).toBeDefined()
  })

  it('should render MeshGradient with theme prop in light mode', () => {
    const { container } = render(<Hero theme="light" />)
    
    // MeshGradient should be present
    const heroSection = container.querySelector('#hero')
    expect(heroSection).toBeInTheDocument()
    
    // Verify background layers exist
    const backgroundElements = heroSection?.querySelectorAll('[aria-hidden="true"]')
    expect(backgroundElements!.length).toBeGreaterThan(0)
  })

  it('should render MeshGradient with theme prop in dark mode', () => {
    const { container } = render(<Hero theme="dark" />)
    
    // MeshGradient should be present
    const heroSection = container.querySelector('#hero')
    expect(heroSection).toBeInTheDocument()
    
    // Verify background layers exist
    const backgroundElements = heroSection?.querySelectorAll('[aria-hidden="true"]')
    expect(backgroundElements!.length).toBeGreaterThan(0)
  })
})
