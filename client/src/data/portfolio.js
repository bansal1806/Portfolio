// ─────────────────────────────────────────────────────────────────────────────
// All portfolio content lives here. Edit this file to update the website.
// (The downloadable CV is generated separately from server/scripts/resume-data.js.)
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Shourya Bansal',
  roles: ['MERN Stack Developer', 'React Developer', 'Node.js & Express Developer', 'Problem Solver'],
  tagline: 'I build fast, accessible and delightful full-stack web apps with MongoDB, Express, React and Node.js.',
  email: 'shouryabansal45@gmail.com',
  location: 'India',
  status: 'Student · Open to internships & fresher roles',
  photo: '/images/profile.svg', // replace with /images/profile.jpg
  socials: {
    github: 'https://github.com/your-username',
    linkedin: 'https://www.linkedin.com/in/your-profile',
  },
  bio: [
    "Hi! I'm Shourya, a Computer Science student and aspiring full-stack developer who loves turning ideas into working products. Most of my work lives in the MERN stack — designing REST APIs with Express, modelling data in MongoDB and crafting responsive interfaces in React.",
    "I care about clean code, good UX and shipping things end-to-end: from the database schema all the way to deployment. When I'm not coding, I'm learning new tools, contributing to side projects and solving problems on coding platforms.",
  ],
  facts: [
    { label: 'Projects built', value: 10, suffix: '+' },
    { label: 'Technologies', value: 15, suffix: '+' },
    { label: 'Certifications', value: 4, suffix: '' },
  ],
};

// level: 0–100. Shown as animated bars with a proficiency tooltip on hover.
export const skillGroups = [
  {
    category: 'Frontend',
    icon: 'layout',
    skills: [
      { name: 'React.js', level: 85 },
      { name: 'JavaScript (ES6+)', level: 85 },
      { name: 'HTML5 & CSS3', level: 90 },
      { name: 'Tailwind CSS', level: 75 },
      { name: 'Framer Motion', level: 65 },
    ],
  },
  {
    category: 'Backend',
    icon: 'server',
    skills: [
      { name: 'Node.js', level: 80 },
      { name: 'Express.js', level: 80 },
      { name: 'MongoDB & Mongoose', level: 75 },
      { name: 'REST API Design', level: 80 },
      { name: 'JWT Authentication', level: 70 },
    ],
  },
  {
    category: 'Tools & Technologies',
    icon: 'tool',
    skills: [
      { name: 'Git & GitHub', level: 85 },
      { name: 'Postman', level: 80 },
      { name: 'VS Code', level: 90 },
      { name: 'Vercel / Render', level: 70 },
      { name: 'Figma', level: 55 },
    ],
  },
];

export const proficiencyLabel = (level) =>
  level >= 85 ? 'Advanced' : level >= 70 ? 'Proficient' : level >= 55 ? 'Intermediate' : 'Beginner';

// Projects: min 3. `year` drives "newest" sorting, `tech` drives the filter chips.
export const projects = [
  {
    slug: 'mern-portfolio',
    name: 'MERN Portfolio',
    year: 2026,
    featured: true,
    gradient: ['#7c3aed', '#06b6d4'],
    emoji: '🚀',
    description:
      'This website! A full-stack portfolio with animated sections, dark/light mode, CV downloads served from Express and a contact form that stores messages in MongoDB.',
    highlights: [
      'React Router SPA with Framer Motion scroll animations and a typewriter hero',
      'Express REST API serving the CV in both PDF and DOCX formats',
      'Contact form persisted with Mongoose, with rate limiting and email notifications via Nodemailer',
      'Deployed with the frontend on Vercel and the API on Render',
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Framer Motion'],
    github: 'https://github.com/your-username/portfolio',
    live: 'https://your-portfolio.vercel.app',
  },
  {
    slug: 'taskflow',
    name: 'TaskFlow — Kanban Board',
    year: 2026,
    featured: true,
    gradient: ['#f59e0b', '#ef4444'],
    emoji: '✅',
    description:
      'A Trello-style task manager with drag-and-drop boards, JWT authentication and per-user workspaces so teams can track work from “To do” to “Done”.',
    highlights: [
      'Drag-and-drop columns and cards with optimistic UI updates',
      'JWT auth with protected routes and hashed passwords (bcrypt)',
      'MongoDB aggregation for board progress statistics',
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    github: 'https://github.com/your-username/taskflow',
    live: 'https://taskflow-demo.vercel.app',
  },
  {
    slug: 'shopkart',
    name: 'ShopKart — E-commerce Store',
    year: 2025,
    featured: true,
    gradient: ['#10b981', '#3b82f6'],
    emoji: '🛒',
    description:
      'An online store with product search, category filters, a persistent cart and checkout, plus an admin dashboard to manage products and orders.',
    highlights: [
      'Global cart state with Redux Toolkit, persisted to localStorage',
      'Admin-only routes for product CRUD and order status updates',
      'Paginated, filterable product API built with Express and Mongoose',
    ],
    tech: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/your-username/shopkart',
    live: 'https://shopkart-demo.vercel.app',
  },
  {
    slug: 'weatherly',
    name: 'Weatherly — Weather Dashboard',
    year: 2025,
    featured: false,
    gradient: ['#0ea5e9', '#6366f1'],
    emoji: '🌦️',
    description:
      'A responsive weather dashboard that shows current conditions and a 5-day forecast for any city using the OpenWeather API, with geolocation and saved cities.',
    highlights: [
      'Debounced city search with autocomplete',
      'Geolocation-based weather on first load',
      'Charts for hourly temperature trends',
    ],
    tech: ['React', 'JavaScript', 'REST API', 'CSS'],
    github: 'https://github.com/your-username/weatherly',
    live: 'https://weatherly-demo.netlify.app',
  },
];

// Vertical timeline — `type` is "education" or "work".
export const timeline = [
  {
    type: 'education',
    title: 'B.Tech in Computer Science & Engineering',
    org: 'Your University Name',
    period: '2023 – 2027',
    details: 'Current CGPA: 8.5 / 10. Coursework: Data Structures, DBMS, Operating Systems, Computer Networks, Web Technologies.',
  },
  {
    type: 'work',
    title: 'Web Development Intern',
    org: 'Company Name',
    period: 'Jun 2026 – Aug 2026',
    details: 'Built reusable React components, integrated Express REST endpoints and designed MongoDB schemas with Mongoose validation.',
  },
  {
    type: 'education',
    title: 'MERN Stack Development Course',
    org: 'Course Provider',
    period: '2026',
    details: 'Hands-on training in MongoDB, Express, React and Node.js, building and deploying full-stack projects.',
  },
  {
    type: 'education',
    title: 'Senior Secondary (Class XII) — PCM',
    org: 'Your School Name',
    period: '2021 – 2023',
    details: 'Physics, Chemistry, Mathematics with Computer Science.',
  },
];

// Certificates: `image` is optional (put files in client/public/certificates/).
export const certifications = [
  {
    title: 'Meta Front-End Developer',
    issuer: 'Coursera',
    date: '2026',
    image: '/certificates/sample-certificate.svg',
    link: 'https://www.coursera.org/',
  },
  {
    title: 'Programming in Java',
    issuer: 'NPTEL',
    date: '2025',
    image: '/certificates/sample-certificate.svg',
    link: 'https://nptel.ac.in/',
  },
  {
    title: 'Node.js Essential Training',
    issuer: 'LinkedIn Learning',
    date: '2025',
    image: '/certificates/sample-certificate.svg',
    link: 'https://www.linkedin.com/learning/',
  },
  {
    title: 'MongoDB Basics',
    issuer: 'MongoDB University',
    date: '2025',
    image: '/certificates/sample-certificate.svg',
    link: 'https://learn.mongodb.com/',
  },
];

export const achievements = [
  { title: 'Hackathon Participant', detail: 'Built a working MERN prototype in 24 hours at a college hackathon.', year: '2025' },
  { title: 'Top Performer — Coding Contest', detail: 'Ranked in the top 10% in an inter-college coding competition.', year: '2025' },
  { title: 'Open Source Contributor', detail: 'Contributed bug fixes and documentation to open-source repositories.', year: '2026' },
];
