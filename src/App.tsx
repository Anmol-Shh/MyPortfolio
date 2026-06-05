import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useActiveSection } from './hooks/useActiveSection'
import { Preloader } from './components/ui/Preloader'
import { Navbar, NAV_ITEMS } from './components/layout/Navbar'
import { ScrollProgressIndicator } from './components/layout/ScrollProgressIndicator'
import { CustomCursor } from './components/ui/CustomCursor'
import { CursorGlow } from './components/ui/CursorGlow'
import { MarqueeTicker } from './components/ui/MarqueeTicker'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Experience } from './components/sections/Experience'
import { Projects } from './components/sections/Projects'
import { Contact } from './components/sections/Contact'

/**
 * Root application component.
 * Composes all sections, layout components, and global state.
 * Requirements: 2.1, 9.1, 10.1, 10.3
 */
function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const { theme, toggle } = useTheme()
  const activeSection = useActiveSection()

  return (
    <>
      {/* Preloader — shown until initial load animation completes */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* Global effects */}
      <CustomCursor />
      <CursorGlow />

      {/* Main app — rendered beneath preloader, visible after it exits */}
      <div
        className={`min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 ${
          preloaderDone ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={!preloaderDone}
      >
        {/* Scroll progress indicator */}
        <ScrollProgressIndicator />

        {/* Navigation */}
        <Navbar
          items={NAV_ITEMS}
          activeSection={activeSection}
          onThemeToggle={toggle}
          theme={theme}
        />

        {/* Main content */}
        <main id="main-content">
          <Hero theme={theme} />
          <MarqueeTicker />
          <About />
          <Skills />
          <MarqueeTicker direction="right" items={['JAVA', 'PYTHON', 'LARAVEL', 'REST APIs', 'MYSQL', 'DSA', 'OOP', 'GIT', 'LINUX', 'CI/CD']} />
          <Experience />
          <Projects />
          <Contact />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 text-center dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Anmol Sharma. Built with ❤️ and React + Vite.
          </p>
        </footer>
      </div>
    </>
  )
}

export default App
