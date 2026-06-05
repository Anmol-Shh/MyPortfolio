import { useState, useEffect } from 'react'
import { NAV_ITEMS } from '../components/layout/Navbar'

/**
 * Tracks which section is currently in the viewport using IntersectionObserver.
 * Returns the sectionId of the most recently intersected section.
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.sectionId)

    const observers: IntersectionObserver[] = []

    sectionIds.forEach((sectionId) => {
      const el = document.getElementById(sectionId)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting) {
            setActiveSection(sectionId)
          }
        },
        { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' },
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  return activeSection
}
