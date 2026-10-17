// Content for the Word (.docx) CV. Mirrors client/public/cv/index.html (the HTML CV,
// which is printed to PDF) — when you edit one, update the other, then run
// `npm run generate:cv` to rebuild files/*.pdf and files/*.docx.
export default {
  name: 'Shourya Bansal',
  title: 'Web Developer',
  contact: [
    { label: '+91 9376666070', url: 'tel:+919376666070' },
    { label: 'shouryabansal02@gmail.com', url: 'mailto:shouryabansal02@gmail.com' },
    { label: 'GitHub', url: 'https://github.com/bansal1806' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/shouryabansal18' },
    { label: 'Certificates', url: 'https://drive.google.com/drive/folders/1f2TnDXEd-9xx8VRbLzsPbZct4EvfvjvT?usp=drive_link' },
  ],
  summary:
    'CSE undergraduate passionate about building scalable, impactful tech products that solve real-world problems. ' +
    'Experienced in transforming ideas into prototypes, refining them through feedback, and deploying production-ready ' +
    'solutions. Dedicated to continuous learning and leveraging emerging technologies to drive meaningful digital transformation.',
  experience: [
    {
      role: 'Tech Lead',
      org: 'Vibe',
      period: 'Aug 2025 – Present',
      desc: 'Leading technical development of a hyperlocal social discovery platform. Architecting privacy-first connections based on skills and interests using modern web stacks.',
    },
    {
      role: 'Tech Lead',
      org: 'Div',
      period: 'Oct 2025 – Present',
      desc: 'Developing a decentralized IP engine converting creative works into liquid tokens with automated, compliant royalty distribution mechanisms.',
    },
    {
      role: 'Game & Web Developer',
      org: 'Punogames',
      period: 'June 2025 – Aug 2025',
      desc: 'Enhanced immersive gaming experiences by integrating complex game mechanics with seamless web interfaces.',
    },
    {
      role: 'Software Developer',
      org: 'Kare Kaise',
      period: 'Apr 2025 – June 2025',
      desc: 'Implemented scalable technical solutions and new feature sets to improve platform performance and user engagement.',
    },
  ],
  projects: [
    { name: 'Vibe', period: 'Aug 2025 – Present', desc: 'Rewires campus discovery with a verified, hyperlocal, privacy-first social layer that intelligently connects students by skills, interests, mood, and intent.' },
    { name: 'Decentralized IP Tokens', period: 'Oct 2025 – Present', desc: 'A decentralized IP engine that turns creative works into liquid tokens with automated, compliant royalty distribution.' },
    { name: 'अBhyaas', period: 'Nov 2024 – Present', desc: 'An innovative AI-centric EdTech solution that transforms knowledge into effective results for competitive practice.' },
    { name: 'CloudGuard AI', period: 'Mar 2025 – Apr 2025', desc: 'Why Manage Cloud when they can manage themselves.' },
    { name: 'FloatChat – AI Platform for Ocean Data', period: 'Jul 2025 – Aug 2025', desc: '(Prototype) Conversational AI for ARGO datasets (temperature, salinity, currents).' },
    { name: 'DevForge', period: 'Dec 2025', desc: 'AI-powered collaborative developer platform with real-time code execution, multi-language support, and integrated DevOps tooling.' },
    { name: 'NexIDE', period: 'Feb 2026', desc: 'Browser-based IDE with multi-language execution, file management, and a modern developer experience built from scratch.' },
    { name: 'Nexus URL', period: 'Apr 2026', desc: 'High-performance URL shortener with analytics dashboards, custom aliases, and optimized redirect latency via caching.' },
  ],
  education: [
    { degree: 'B.Tech in CS Engineering', org: 'JK Lakshmipat University, Jaipur', period: '2024 – 2028' },
  ],
  skills: [
    ['Programming & Scripting', 'C, Python, JavaScript, Bash'],
    ['Web Development', 'HTML, CSS, Markdown, JSON, React.js, Node.js, Express.js, Tailwind CSS, Bootstrap, FastAPI'],
    ['Databases', 'MySQL, PostgreSQL, SQLite, MongoDB'],
    ['Data Science & AI/ML', 'PyTorch, Scikit-learn, NumPy, Pandas, Matplotlib, Plotly, Jupyter, Anaconda'],
    ['DevOps & Tools', 'Git, GitHub, Vercel, Netlify, Render, GitHub Actions, Postman'],
    ['Soft Skills', 'Leadership, Teamwork, Problem-Solving, Public Speaking'],
  ],
  achievements: [
    ['State Level Open AI Hackathon', 'Jan 2026'],
    ['Business Pitch B-Plan, IIT Jodhpur', 'Jan 2026'],
    ['Business Darbar, IIT Jodhpur', 'Jan 2026'],
    ['DBMS Certification, Infosys', 'Dec 2025'],
    ['Most Innovative Pitch, PitchFest 2K25 (ICFAI University)', 'Oct 2025'],
    ['4th Position, House of Hack (Hackingly)', 'Sep 2025'],
    ['Certified Web Developer, WsCube Tech', 'Jan 2025'],
    ['Gold Medalist, West Zone Archery', ''],
  ],
};
