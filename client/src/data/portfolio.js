// ─────────────────────────────────────────────────────────────────────────────
// All portfolio content lives here. Edit this file to update the website.
// (The downloadable CV is generated separately from server/scripts/resume-data.js.)
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Shourya Bansal',
  roles: ['MERN Stack Developer', 'React Developer', 'Node.js & Express Developer', 'Problem Solver'],
  tagline: 'I build fast, accessible and delightful full-stack web apps with MongoDB, Express, React and Node.js.',
  email: 'shouryabansal02@gmail.com',
  location: 'India',
  status: 'Student · Open to internships & fresher roles',
  photo: '/images/profile.webp', // transparent artistic portrait (blends into both themes)
  socials: {
    github: 'https://github.com/bansal1806',
    linkedin: 'https://www.linkedin.com/in/shourya18',
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

// Projects. `tech` drives the filter chips, `year` the date sort (null = undated, sorted last).
// `preview` is a full-page screenshot of the live site — refresh them all with
// `npm run capture:previews` (client folder) after a site changes.
const GH = 'https://github.com/bansal1806';

export const projects = [
  {
    slug: 'nexide',
    name: 'NexIDE',
    year: 2026,
    featured: true,
    description:
      'A browser-based, AI-powered code editor with live code execution, a visual map of your codebase and a Gemini AI pair programmer.',
    highlights: [
      'Monaco editor core with multi-language execution and file management in the browser',
      'Visual code map that renders project structure and logic with D3.js',
      'AI pair programmer powered by Gemini with codebase-aware context',
      'Local-first workspace synced through Supabase',
    ],
    tech: ['React', 'Vite', 'Monaco Editor', 'D3.js', 'Gemini AI', 'Supabase'],
    github: `${GH}/NexIDE`,
    live: 'https://nex-ide.vercel.app/',
  },
  {
    slug: 'invoiceflow',
    name: 'InvoiceFlow',
    year: 2026,
    featured: true,
    description:
      'A full-stack, multi-tenant invoice management platform: create, send and track invoices, automate recurring billing and generate PDFs.',
    highlights: [
      'Multi-tenant architecture so each business manages its own clients, invoices and inventory',
      'Automated recurring billing with scheduled cron jobs',
      'Invoice PDF generation and online payments through Razorpay',
      'Next.js frontend backed by a Node.js/Express API and MongoDB Atlas',
    ],
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Razorpay'],
    github: `${GH}/INVOICE-FLOW`,
    live: 'https://invoiceflow-orpin.vercel.app/',
  },
  {
    slug: 'dhund',
    embeddable: true, // site allows iframes → live preview on the detail page
    name: 'DHUND',
    year: 2026,
    featured: true,
    description:
      'An AI-powered missing person recovery system that combines multimodal vision analysis, semantic vector search and citizen crowdsourcing in one command center.',
    highlights: [
      'Face recognition and multimodal AI vision analysis on uploaded and surveillance images',
      'Semantic search over case data with pgvector embeddings in Supabase',
      'Real-time surveillance simulation and crowdsourced sighting reports',
      'React frontend with a Python FastAPI backend',
    ],
    tech: ['React', 'FastAPI', 'Python', 'Supabase', 'pgvector', 'Computer Vision'],
    github: `${GH}/DHUND`,
    live: 'https://dhund.vercel.app/',
  },
  {
    slug: 'cloudguard-ai',
    name: 'CloudGuard AI',
    year: 2025,
    featured: true,
    description:
      'A digital-twin platform for multi-cloud management across AWS, Azure and GCP, with AI-powered predictive analytics and autonomous policy evolution.',
    highlights: [
      'Digital twin of cloud infrastructure for a single view across AWS, Azure and GCP',
      'Deep-learning models that predict load and cost trends',
      'Autonomous policy suggestions and cross-cloud intelligence dashboards',
    ],
    tech: ['Next.js', 'TypeScript', 'TensorFlow', 'FastAPI', 'Tailwind CSS', 'Prisma'],
    github: `${GH}/CloudGuard-AI`,
    live: 'https://cloud-guard-ai-plum.vercel.app/',
  },
  {
    slug: 'hackjklu',
    // Card runs the real site. Requires hackjklu.com to allow framing from this portfolio
    // (frame-ancestors in its vercel.json) — otherwise the browser blocks the iframe.
    liveCard: true,
    name: 'HackJKLU v5.0',
    year: 2026,
    featured: true,
    description:
      'The official website for HackJKLU v5.0, a Greek mythology themed hackathon at JK Lakshmipat University, built as an immersive 3D scrolling experience.',
    highlights: [
      'Cinematic parallax journey through three realms: Zeus, Poseidon and Hades',
      'Interactive 3D elements, particle effects and a dome gallery of past events',
      'Animations with Framer Motion and GSAP, with adaptive quality for slower devices',
    ],
    tech: ['Next.js', 'TypeScript', 'Framer Motion', 'GSAP'],
    github: `${GH}/HackJKLU-v5.0`,
    live: 'https://www.hackjklu.com/',
  },
  {
    slug: 'ab-creation',
    embeddable: true, // site allows iframes → live preview on the detail page
    name: 'AB Creation',
    year: null,
    featured: true,
    description:
      'An online store for custom apparel and printing, where customers can shop ready-made printed tees or bring their own design.',
    tech: ['Next.js', 'E-commerce'],
    live: 'https://ab-creations-web.vercel.app/',
  },
  {
    slug: 'antah',
    name: 'Antah',
    year: null,
    featured: false,
    description:
      'A spiritual wellness store for authentic Rudraksha, energized gemstone bracelets and malas, with shopping by Rashi, concern or sacred stone.',
    tech: ['Shopify', 'E-commerce'],
    live: 'https://antah.in/',
  },
  {
    slug: 'soqo',
    name: 'SOQO',
    year: null,
    featured: false,
    description:
      'The storefront for SOQO, an Indian brand of soft, washable leakproof underwear designed to replace daily pantyliners.',
    tech: ['Shopify', 'E-commerce'],
    live: 'https://soqo.in/',
  },
  {
    slug: 'exemplar-jewels',
    name: 'Exemplar Jewels',
    year: null,
    featured: false,
    description: 'An online jewellery store showcasing and selling Exemplar’s jewellery collections.',
    tech: ['Shopify', 'E-commerce'],
    live: 'https://exemplarjewels.com/',
  },
  {
    slug: 'in-plain-sight',
    name: 'In Plain Sight',
    year: null,
    featured: false,
    description:
      'An e-commerce store for premium hand-pounded spices and cold-pressed oils, made honestly for modern families.',
    tech: ['Shopify', 'E-commerce'],
    live: 'https://inplainsight.co.in/',
  },
].map((p) => ({ preview: `/previews/${p.slug}.webp`, ...p }));

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
