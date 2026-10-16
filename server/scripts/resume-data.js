// Single source of truth for the downloadable CV.
// Edit this file, then run `npm run generate:cv` to rebuild files/*.pdf and files/*.docx.
export default {
  name: 'Shourya Bansal',
  title: 'MERN Stack Developer',
  contact: {
    email: 'shouryabansal45@gmail.com',
    location: 'India',
    github: 'github.com/your-username',
    linkedin: 'linkedin.com/in/your-profile',
    portfolio: 'your-portfolio.vercel.app',
  },
  summary:
    'Full-stack developer focused on the MERN stack (MongoDB, Express.js, React, Node.js). ' +
    'I enjoy building responsive, accessible interfaces backed by clean REST APIs, and I care about ' +
    'shipping projects end-to-end — from database schema to deployment.',
  skills: [
    ['Frontend', 'React, React Router, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Framer Motion'],
    ['Backend', 'Node.js, Express.js, REST APIs, JWT Authentication, Mongoose'],
    ['Database', 'MongoDB, MongoDB Atlas, MySQL'],
    ['Tools', 'Git & GitHub, VS Code, Postman, Vercel, Render, npm, Figma'],
  ],
  experience: [
    {
      role: 'Web Development Intern',
      org: 'Company Name',
      period: 'Jun 2026 – Aug 2026',
      points: [
        'Built reusable React components and integrated them with Express REST endpoints.',
        'Designed MongoDB schemas and wrote validation with Mongoose.',
        'Collaborated through Git pull requests and code reviews.',
      ],
    },
  ],
  projects: [
    {
      name: 'Personal Portfolio (MERN)',
      stack: 'React, Express, MongoDB, Framer Motion',
      desc: 'Responsive portfolio with dark mode, animated sections, CV downloads served from Express and a contact form stored in MongoDB.',
    },
    {
      name: 'TaskFlow — Kanban Task Manager',
      stack: 'React, Node.js, Express, MongoDB, JWT',
      desc: 'Drag-and-drop task boards with user authentication, protected routes and real-time progress tracking.',
    },
    {
      name: 'ShopKart — E-commerce Store',
      stack: 'React, Redux Toolkit, Express, MongoDB, Stripe',
      desc: 'Product catalogue with search and filters, cart, checkout flow and an admin dashboard for orders.',
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      org: 'Your University Name',
      period: '2023 – 2027',
      note: 'CGPA: 8.5 / 10',
    },
    {
      degree: 'Senior Secondary (Class XII), PCM',
      org: 'Your School Name',
      period: '2021 – 2023',
      note: '',
    },
  ],
  certifications: [
    'MERN Stack Development Course — 2026',
    'Meta Front-End Developer — Coursera',
    'Programming in Java — NPTEL',
    'Node.js Essential Training — LinkedIn Learning',
  ],
};
