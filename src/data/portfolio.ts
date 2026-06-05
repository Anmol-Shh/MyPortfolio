import type { PortfolioData } from '../types'

export const portfolioData: PortfolioData = {
  name: 'Anmol Sharma',
  title: 'Software Engineer',
  tagline: 'Building scalable backend systems with clean code and sharp problem-solving.',
  resumeUrl: '/resume.pdf',

  about: {
    bio: 'I\'m a Software Engineer with a strong backend focus, passionate about building performant, scalable systems. I thrive on solving complex problems — from optimizing API response times to architecting clean, maintainable codebases. When I\'m not coding, I\'m sharpening my DSA skills on LeetCode and GeeksforGeeks.',
    photoUrl: '/ProfessionalPIC.png',
    education: [
      {
        institution: 'Graphic Era University',
        degree: 'B.Tech in Computer Engineering',
        period: '2020 – 2024',
        grade: 'CGPA 8.26',
      },
      {
        institution: "Mother's Glory Public School",
        degree: 'Higher Secondary (Class XII)',
        period: '2019 – 2020',
        grade: '',
      },
    ],
  },

  skills: [
    // Languages
    { name: 'Java', icon: 'devicon-java-plain', category: 'languages' },
    { name: 'Python', icon: 'devicon-python-plain', category: 'languages' },
    { name: 'C++', icon: 'devicon-cplusplus-plain', category: 'languages' },
    { name: 'JavaScript', icon: 'devicon-javascript-plain', category: 'languages' },

    // Backend
    { name: 'Node.js', icon: 'devicon-nodejs-plain', category: 'backend' },
    { name: 'Laravel', icon: 'devicon-laravel-plain', category: 'backend' },
    { name: 'REST APIs', icon: 'devicon-fastapi-plain', category: 'backend' },
    { name: 'MySQL', icon: 'devicon-mysql-plain', category: 'backend' },
    { name: 'Redis', icon: 'devicon-redis-plain', category: 'backend' },

    // Tools
    { name: 'Git', icon: 'devicon-git-plain', category: 'tools' },
    { name: 'Postman', icon: 'devicon-postman-plain', category: 'tools' },
    { name: 'Linux', icon: 'devicon-linux-plain', category: 'tools' },
    { name: 'CI/CD', icon: 'devicon-github-original', category: 'tools' },

    // Core CS
    { name: 'DSA', category: 'core-cs' },
    { name: 'OOP', category: 'core-cs' },
    { name: 'Problem Solving', category: 'core-cs' },
  ],

  problemSolvingStats: '150+ DSA problems solved across LeetCode and GeeksforGeeks',

  experience: [
    {
      company: 'ASPIA Infotech',
      title: 'Software Engineer',
      period: 'July 2025 – Current',
      location: 'India (Remote)',
      achievements: [
        'Reduced API response time by 35–40% through query optimization and caching strategies.',
        'Improved overall API response performance by 18% via payload restructuring and indexing.',
        'Reduced frontend bundle size by 35% by implementing code-splitting and lazy loading.',
        'Accelerated issue resolution by 45% by introducing structured logging and monitoring.',
        'Cut development time by 30% by building reusable component libraries and shared utilities.',
      ],
    },
    {
      company: 'WebMark HQ',
      title: 'Software Developer Internship',
      period: 'Feb 2024 – July 2024',
      location: 'Dehradun, India',
      achievements: [
        'Built and maintained RESTful APIs using Laravel, serving 10,000+ monthly active users.',
        'Designed and optimized MySQL schemas, reducing query execution time by 25%.',
        'Collaborated with frontend teams to integrate APIs, cutting integration bugs by 40%.',
        'Implemented automated testing pipelines, increasing code coverage from 45% to 78%.',
      ],
    },
  ],

  projects: [
    {
      id: 'moonlit-threads',
      name: 'Moonlit Threads',
      description:
        'A full-stack e-commerce platform for fashion with real-time inventory management, AWS S3 media storage, and GSAP-powered animations delivering a premium shopping experience.',
      techStack: [
        { name: 'MongoDB', category: 'tool' },
        { name: 'Express.js', category: 'framework' },
        { name: 'React', category: 'framework' },
        { name: 'Node.js', category: 'framework' },
        { name: 'Tailwind CSS', category: 'framework' },
        { name: 'GSAP', category: 'tool' },
        { name: 'AWS S3', category: 'cloud' },
      ],
      githubUrl: 'https://github.com/Anmol-Shh/Moonlit_Threads_Frontend',
      liveUrl: 'https://moonlit-threads-frontend.vercel.app/',
      featured: true,
    },
    {
      id: 'movie-recommender',
      name: 'Movie Recommender System',
      description:
        'A content-based movie recommendation engine built with Python, leveraging cosine similarity on TF-IDF vectors to suggest films based on user preferences, deployed as an interactive Streamlit app.',
      techStack: [
        { name: 'Python', category: 'language' },
        { name: 'Pandas', category: 'tool' },
        { name: 'NumPy', category: 'tool' },
        { name: 'Streamlit', category: 'framework' },
        { name: 'Scikit-learn', category: 'tool' },
      ],
      githubUrl: 'https://github.com/Anmol-Shh/MovieRecommendationSystem',
      liveUrl: 'https://anmol-shh-movierecommendationsystem-main-ngcn8q.streamlit.app/',
      featured: true,
    },
  ],

  contact: {
    email: 'anmolsharma6503@gmail.com',
    phone: '+91-9027192606',
    linkedinUrl: 'https://www.linkedin.com/in/anmol-shharma/',
    githubUrl: 'https://github.com/Anmol-Shh/',
  },
}
