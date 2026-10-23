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
    { label: 'Certifications', value: 9, suffix: '' },
  ],
};

// level: 0–100. Shown as animated bars with a proficiency tooltip on hover.
// logo: key into SKILL_LOGOS (sections/Skills.jsx) — the top 3 per group appear on the card art.
export const skillGroups = [
  {
    category: 'Frontend',
    icon: 'layout',
    skills: [
      { name: 'React.js', logo: 'react', level: 85 },
      { name: 'JavaScript (ES6+)', logo: 'javascript', level: 85 },
      { name: 'HTML5 & CSS3', logo: 'html', level: 90 },
      { name: 'Tailwind CSS', logo: 'tailwind', level: 75 },
      { name: 'Framer Motion', logo: 'framer', level: 65 },
    ],
  },
  {
    category: 'Backend',
    icon: 'server',
    skills: [
      { name: 'Node.js', logo: 'node', level: 80 },
      { name: 'Express.js', logo: 'express', level: 80 },
      { name: 'MongoDB & Mongoose', logo: 'mongodb', level: 75 },
      { name: 'REST API Design', logo: 'api', level: 80 },
      { name: 'JWT Authentication', logo: 'jwt', level: 70 },
    ],
  },
  {
    category: 'Tools & Technologies',
    icon: 'tool',
    skills: [
      { name: 'Git & GitHub', logo: 'git', level: 85 },
      { name: 'Postman', logo: 'postman', level: 80 },
      { name: 'VS Code', logo: 'vscode', level: 90 },
      { name: 'Vercel / Render', logo: 'vercel', level: 70 },
      { name: 'Figma', logo: 'figma', level: 55 },
    ],
  },
];

export const proficiencyLabel = (level) =>
  level >= 85 ? 'Advanced' : level >= 70 ? 'Proficient' : level >= 55 ? 'Intermediate' : 'Beginner';

// Projects. `tech` drives the filter chips (technologies only), `year` the date sort
// (null = undated, sorted last; same-year projects keep this file's order).
// `role` is an optional label on the card and detail page, e.g. 'Solo project', 'Team lead'.
// `live` is optional (null = not deployed): the card then shows its screenshot with no Live
// site button; add `/previews/<slug>.webp` by hand since capture:previews needs a live URL.
// `embeddable`: try the live site on the detail page. `liveCard`: also run it inside the card
// (large screens). Both are confirmed at runtime by the API's embed check.
// `preview` is a full-page screenshot of the live site — refresh them all with
// `npm run capture:previews` (client folder) after a site changes.
const GH = 'https://github.com/bansal1806';

export const projects = [
  {
    slug: 'vibe',
    name: 'Vibe',
    year: 2026,
    featured: true,
    description:
      'A verified-students-only campus social platform: meet people at your college, join pop-up "Now Rooms" and unlock each other’s identity as trust grows. Web, iOS and Android on one backend.',
    highlights: [
      'Progressive identity: profiles start as an alias and avatar, and details unlock only as two-way trust grows',
      'Pop-up Now Rooms with group chats that close when the room ends, plus time capsules that open on a set date',
      'Real-time chat over Server-Sent Events with Redis pub/sub, and privacy-safe push notifications',
      'Next.js web app and Expo (React Native) iOS/Android apps sharing one API, database and avatar engine',
      'Email-code sign-in for .edu addresses, rate limits, CSRF protection and row-level security on every table',
    ],
    tech: ['Next.js', 'React Native', 'Expo', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'Supabase'],
    // No github link: the repo is private.
    live: 'https://vibe-mu-ebon.vercel.app/',
  },
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
    embeddable: true,
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
    tech: ['React', 'FastAPI', 'Python', 'Supabase', 'pgvector'],
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
    // Requires hackjklu.com to allow framing from this portfolio (frame-ancestors in its
    // vercel.json) — otherwise the embed check fails and the screenshot shows.
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
    embeddable: true,
    name: 'AB Creation',
    year: null,
    featured: true,
    description:
      'An online store for custom apparel and printing, where customers can shop ready-made printed tees or bring their own design.',
    tech: ['Next.js'],
    live: 'https://ab-creations-web.vercel.app/',
  },
  {
    slug: 'antah',
    name: 'Antah',
    year: null,
    featured: true,
    role: 'Client project',
    description:
      'Shopify storefront for Antah, a spiritual wellness brand selling Rudraksha, gemstone bracelets and malas, with shopping by Rashi, concern or sacred stone.',
    tech: ['Shopify'],
    live: 'https://antah.in/',
  },
  {
    slug: 'soqo',
    name: 'SOQO',
    year: null,
    featured: true,
    role: 'Client project',
    description:
      'Shopify storefront for SOQO, an Indian brand of washable leakproof underwear, presenting the product range and its everyday benefits.',
    tech: ['Shopify'],
    live: 'https://soqo.in/',
  },
  {
    slug: 'exemplar-jewels',
    name: 'Exemplar Jewels',
    year: null,
    featured: true,
    role: 'Client project',
    description: 'Shopify storefront for Exemplar Jewels, showcasing and selling the brand’s jewellery collections online.',
    tech: ['Shopify'],
    live: 'https://exemplarjewels.com/',
  },
  {
    slug: 'in-plain-sight',
    name: 'In Plain Sight',
    year: null,
    featured: true,
    role: 'Client project',
    description:
      'Shopify storefront for In Plain Sight, a brand of hand-pounded spices and cold-pressed oils.',
    tech: ['Shopify'],
    live: 'https://inplainsight.co.in/',
  },
].map((p) => ({ preview: `/previews/${p.slug}.webp`, ...p }));

// Journey timeline — `type` is "education" or "work". `image` (in public/images) fills the
// step's card; logos on a solid background use `imageFit: 'contain'` with a matching `imageBg`.
// `period` is optional — without it the card shows the role instead.
export const timeline = [
  {
    type: 'education',
    title: 'B.Tech in Computer Science & Engineering',
    org: 'JK Lakshmipat University, Jaipur',
    period: '2024 – 2028',
    details: 'Pursuing a B.Tech in Computer Science and Engineering while building products, leading tech teams and taking part in hackathons.',
    image: '/images/jklu.webp',
  },
  {
    type: 'work',
    title: 'Founder',
    org: 'RamantraX',
    period: null,
    details: 'Founder of RamantraX — “an unknown variable of innovation”.',
    image: '/images/ramantra_logo.png',
    imageFit: 'contain',
    imageBg: '#000000',
  },
  {
    type: 'education',
    title: 'MERN Stack Development Course',
    org: 'WsCube Tech',
    period: '2025',
    details: 'Hands-on training in MongoDB, Express, React and Node.js, building and deploying full-stack projects. Certified Web Developer, WsCube Tech.',
    image: '/images/WsCube-Tech.webp',
    imageFit: 'contain',
    imageBg: '#ffffff',
  },
  {
    type: 'education',
    title: 'Senior Secondary (Classes XI & XII)',
    org: 'Vardhman International School',
    period: '2022 – 2024',
    details: 'Completed Classes XI and XII at Vardhman International School.',
    image: '/images/VIS.webp',
  },
];

// Certificates — images live in public/certificates/, originals in Google Drive:
//   Courses: https://drive.google.com/drive/folders/1YOZN9HD9dm0i7Ut5x__cEHUYDoPFHuV7
//   Events:  https://drive.google.com/drive/folders/1aN3G_6IlNdF4v3fAQ2Y8Q3GXWbbrv_le
// `category` drives the filter tabs, `sort` (YYYY-MM) the order, `links[0]` is the main link.
const drive = (id) => `https://drive.google.com/file/d/${id}/view`;

export const certificateFolders = {
  course: 'https://drive.google.com/drive/folders/1YOZN9HD9dm0i7Ut5x__cEHUYDoPFHuV7?usp=sharing',
  event: 'https://drive.google.com/drive/folders/1aN3G_6IlNdF4v3fAQ2Y8Q3GXWbbrv_le?usp=sharing',
};

export const certifications = [
  {
    title: 'Red Hat System Administration I (RH124)',
    issuer: 'Red Hat',
    category: 'course',
    kind: 'Attendance · 40 credit hours',
    date: 'Apr 2026',
    sort: '2026-04',
    image: '/certificates/redhat-rh124.webp',
    links: [
      { label: 'Verify on Credly', url: 'https://www.credly.com/badges/70285a56-f12a-4032-ac65-d6dc3b25a304' },
      { label: 'Certificate', url: drive('1buFZMYk6dn-7Fu_4HKQom3Uq3Ty9vQCC') },
    ],
  },
  {
    title: 'Pre Hackathon 2026',
    issuer: 'WsCube Tech × HackJKLU 5.0',
    category: 'event',
    kind: 'Participation',
    date: 'Feb 2026',
    sort: '2026-02',
    image: '/certificates/pre-hackathon-2026.webp',
    links: [{ label: 'Certificate', url: drive('1JKBEdi-mYEBFm_cBWVhsT5amw1J4WFxY') }],
  },
  {
    title: 'B-Plan — Prometeo × E-Conclave 2026',
    issuer: 'IIT Jodhpur',
    category: 'event',
    kind: 'Participation · Online round & event',
    date: 'Jan 2026',
    sort: '2026-01',
    image: '/certificates/iitj-bplan.webp',
    links: [
      { label: 'Certificate', url: drive('1M1CEYmXWedfOqLV_Hg8ff9JdCHKnsMq5') },
      { label: 'Online round (Unstop)', url: drive('1HfG337g4elSof9inHA-gyZmRXYyZfQcE') },
    ],
  },
  {
    title: 'Business Darbar — Prometeo × E-Conclave 2026',
    issuer: 'IIT Jodhpur',
    category: 'event',
    kind: 'Participation · Pitch deck & event',
    date: 'Jan 2026',
    sort: '2026-01',
    image: '/certificates/iitj-business-darbar.webp',
    links: [
      { label: 'Certificate', url: drive('1RrZp98FQfYx0g8JIWnj6oXNJ6PT8TGxY') },
      { label: 'Pitch deck round (Unstop)', url: drive('1SSldkbLY49mZLgzGIBQsWewam3zwovtF') },
    ],
  },
  {
    title: 'OpenAI Academy × NxtWave Regional Buildathon — Rajasthan',
    issuer: 'OpenAI Academy × NxtWave',
    category: 'event',
    kind: 'Participation · 2-day buildathon',
    date: 'Jan 2026',
    sort: '2026-01',
    image: '/certificates/openai-buildathon.webp',
    links: [{ label: 'Certificate', url: drive('1TgNwfyV8x0HTrtG_YzQguHmKj8sMAh8h') }],
  },
  {
    title: 'Database Management System — Part 1',
    issuer: 'Infosys Springboard',
    category: 'course',
    kind: 'Course completion',
    date: 'Nov 2025',
    sort: '2025-11',
    image: '/certificates/infosys-dbms.webp',
    links: [{ label: 'Certificate', url: drive('1Stj73bbx-1nBNReqpJbs-bVO2U45jeDE') }],
  },
  {
    title: 'Generative AI Mastery Workshop',
    issuer: 'OpenAI Academy × NxtWave',
    category: 'event',
    kind: 'Appreciation · GenAI Buildathon',
    date: 'Sep 2025',
    sort: '2025-09',
    image: '/certificates/openai-genai-workshop.webp',
    links: [{ label: 'Certificate', url: drive('1QEYKtUqerG196rdoT88mTLIdXO8Dyfpc') }],
  },
  {
    title: 'House of Hack (Edition II) — 24-Hour Hackathon',
    issuer: 'Hackingly · J Startup House, Jaipur',
    category: 'event',
    kind: 'Participation · Team Code Pioneers',
    date: 'Sep 2025',
    sort: '2025-09',
    image: '/certificates/house-of-hack.webp',
    links: [{ label: 'Certificate', url: drive('19FStniXjmribIpdvis3_VDYlO8AKJp_4') }],
  },
  {
    title: 'MERN Stack Web Development (7 months)',
    issuer: 'WsCube Tech',
    category: 'course',
    kind: 'Course completion · Grade A',
    date: 'Jun 2024 – Jan 2025',
    sort: '2025-01',
    image: '/certificates/wscube-mern.webp',
    links: [{ label: 'Certificate', url: drive('1o75a5-U7PdB3vfj6e1lkZLTBbXnwgAjs') }],
  },
];

// Awards from the CV that aren't covered by a certificate card above.
export const achievements = [
  { title: '4th Position — House of Hack', detail: '24-hour House of Hack (Edition II) hackathon by Hackingly, Jaipur.', year: 'Sep 2025' },
  { title: 'Most Innovative Pitch — PitchFest 2K25', detail: 'Awarded at PitchFest 2K25, ICFAI University.', year: 'Oct 2025' },
  { title: 'Gold Medalist — West Zone Archery', detail: 'Gold medal in archery at the West Zone level.', year: '' },
];
