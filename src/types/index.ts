// ─── Skill ───────────────────────────────────────────────────────────────────

export type SkillCategory = 'languages' | 'backend' | 'tools' | 'core-cs'

export interface Skill {
  name: string
  icon?: string // SVG path or Devicon class
  category: SkillCategory
}

// ─── Education ───────────────────────────────────────────────────────────────

export interface Education {
  institution: string
  degree: string
  period: string
  grade: string
}

// ─── Experience ──────────────────────────────────────────────────────────────

export interface ExperienceRole {
  company: string
  title: string
  period: string
  location: string
  achievements: string[] // bullet points with quantified metrics
}

// ─── Projects ────────────────────────────────────────────────────────────────

export interface TechTag {
  name: string
  category: 'language' | 'framework' | 'tool' | 'cloud'
}

export interface Project {
  id: string
  name: string
  description: string // 1–2 sentences
  techStack: TechTag[]
  githubUrl: string
  liveUrl?: string
  featured: boolean
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactInfo {
  email: string
  phone: string
  linkedinUrl: string
  githubUrl: string
}

// ─── Portfolio Data ───────────────────────────────────────────────────────────

export interface PortfolioData {
  name: string
  title: string
  tagline: string
  resumeUrl: string
  about: {
    bio: string
    photoUrl: string
    education: Education[]
  }
  skills: Skill[]
  problemSolvingStats: string
  experience: ExperienceRole[]
  projects: Project[]
  contact: ContactInfo
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light'

export interface ThemeState {
  theme: Theme
  toggle: () => void
}

// ─── Animation ───────────────────────────────────────────────────────────────

export interface SectionAnimationConfig {
  sectionId: string
  trigger: string // CSS selector
  start: string // e.g. "top 80%"
  staggerDelay: number // ms between child elements
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

export interface ContactFormState {
  name: string
  email: string
  message: string
}

export interface ContactFormStatus {
  type: 'idle' | 'submitting' | 'success' | 'error'
  message?: string
}
