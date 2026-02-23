import Career from "./career.model.js"; // Adjust path if necessary

const careers = [
  {
    title: "Frontend Developer",
    description: "Build beautiful UIs with React, CSS, and modern tooling.",
    industry: "Engineering",
    avg_salary: 70000,
    growth_rate: "+10% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://developer.mozilla.org/en-US/docs/Learn_web_development", // Structured front‑end tutorials :contentReference[oaicite:1]{index=1}
  },
  {
    title: "Backend Developer",
    description: "Design APIs, manage databases, and power server‑side logic.",
    industry: "Engineering",
    avg_salary: 80000,
    growth_rate: "+15% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.codecademy.com/learn/paths/back-end-engineer-career-path", // Backend career path basics :contentReference[oaicite:2]{index=2}
  },
  {
    title: "Full Stack Developer",
    description: "Own the entire stack from UI to database and deployment.",
    industry: "Engineering",
    avg_salary: 90000,
    growth_rate: "+20% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.freecodecamp.org/", // Free full stack curriculum & certifications :contentReference[oaicite:3]{index=3}
  },
  {
    title: "DevOps Engineer",
    description: "CI/CD, containers, cloud infra — keep systems running.",
    industry: "Engineering",
    avg_salary: 95000,
    growth_rate: "+18% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.edx.org/learn/devops", // DevOps courses from top institutions :contentReference[oaicite:4]{index=4}
  },
  {
    title: "Mobile Developer",
    description: "Ship iOS and Android apps with React Native or Swift/Kotlin.",
    industry: "Engineering",
    avg_salary: 85000,
    growth_rate: "+12% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.codecademy.com/learn/paths/build-web-apps-with-react", // React & mobile basics :contentReference[oaicite:5]{index=5}
  },
  {
    title: "Blockchain Developer",
    description: "Smart contracts, DeFi, and decentralized applications.",
    industry: "Engineering",
    avg_salary: 120000,
    growth_rate: "+30% over 5 years",
    difficulty: "Advanced",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=blockchain", // Curated blockchain courses :contentReference[oaicite:6]{index=6}
  },
  {
    title: "Cloud Engineer",
    description: "AWS, GCP, or Azure — architect scalable cloud solutions.",
    industry: "Engineering",
    avg_salary: 100000,
    growth_rate: "+25% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.edx.org/learn/cloud-computing", // Cloud computing courses :contentReference[oaicite:7]{index=7}
  },
  {
    title: "Cybersecurity Engineer",
    description: "Protect systems, conduct pen tests, and secure pipelines.",
    industry: "Engineering",
    avg_salary: 110000,
    growth_rate: "+15% over 5 years",
    difficulty: "Advanced",
    tags: [],
    sponsorship_link: "https://www.edx.org/learn/cybersecurity", // Cybersecurity courses globally :contentReference[oaicite:8]{index=8}
  },
  {
    title: "Embedded Systems",
    description: "Low‑level C/C++ for hardware, IoT, and real‑time systems.",
    industry: "Engineering",
    avg_salary: 105000,
    growth_rate: "+12% over 5 years",
    difficulty: "Advanced",
    tags: [],
    sponsorship_link: "https://www.udacity.com/school/programming", // Low‑level & embedded related programming courses :contentReference[oaicite:9]{index=9}
  },
  {
    title: "QA / Test Engineer",
    description: "Automated testing, quality assurance, and bug hunting.",
    industry: "Engineering",
    avg_salary: 60000,
    growth_rate: "+8% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://www.freecodecamp.org/", // QA and coding fundamentals via freeCodeCamp :contentReference[oaicite:10]{index=10}
  },
  {
    title: "Data Scientist",
    description: "Stats, ML models, and storytelling through data.",
    industry: "Data & AI",
    avg_salary: 110000,
    growth_rate: "+18% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=data%20science", // Data science specializations :contentReference[oaicite:11]{index=11}
  },
  {
    title: "ML Engineer",
    description: "Deploy and scale machine learning models in production.",
    industry: "Data & AI",
    avg_salary: 120000,
    growth_rate: "+20% over 5 years",
    difficulty: "Advanced",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=machine%20learning", // Machine learning courses :contentReference[oaicite:12]{index=12}
  },
  {
    title: "AI Engineer",
    description: "LLMs, RAG pipelines, and AI‑powered product engineering.",
    industry: "Data & AI",
    avg_salary: 115000,
    growth_rate: "+22% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.edx.org/learn/artificial-intelligence", // AI courses from top institutions :contentReference[oaicite:13]{index=13}
  },
  {
    title: "Data Engineer",
    description: "ETL pipelines, warehouses, and big data infrastructure.",
    industry: "Data & AI",
    avg_salary: 95000,
    growth_rate: "+10% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=data%20engineering", // Data engineering learning paths :contentReference[oaicite:14]{index=14}
  },
  {
    title: "Data Analyst",
    description: "SQL, dashboards, and actionable business insights.",
    industry: "Data & AI",
    avg_salary: 65000,
    growth_rate: "+8% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://www.freecodecamp.org/news/learn-data-analytics-for-free/", // Data analytics free resources :contentReference[oaicite:15]{index=15}
  },
  {
    title: "UX Designer",
    description: "User research, wireframes, and end‑to‑end experiences.",
    industry: "Design",
    avg_salary: 75000,
    growth_rate: "+15% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=ux%20design", // UX design courses :contentReference[oaicite:16]{index=16}
  },
  {
    title: "UI Designer",
    description: "Figma, design systems, and pixel‑perfect visual craft.",
    industry: "Design",
    avg_salary: 70000,
    growth_rate: "+12% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=ui%20design", // UI design courses :contentReference[oaicite:17]{index=17}
  },
  {
    title: "Product Designer",
    description: "Strategy + craft: shape the full product experience.",
    industry: "Design",
    avg_salary: 85000,
    growth_rate: "+20% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=product%20design", // Product design basics :contentReference[oaicite:18]{index=18}
  },
  {
    title: "Motion Designer",
    description: "After Effects, Lottie, and bringing interfaces to life.",
    industry: "Design",
    avg_salary: 80000,
    growth_rate: "+15% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.udacity.com/school/programming", // Motion and designer animation courses :contentReference[oaicite:19]{index=19}
  },
  {
    title: "Product Manager",
    description: "Define roadmaps, align teams, and ship products.",
    industry: "Product",
    avg_salary: 105000,
    growth_rate: "+18% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=product%20management", // PM courses online :contentReference[oaicite:20]{index=20}
  },
  {
    title: "Technical PM",
    description: "Bridge engineering and business with technical fluency.",
    industry: "Product",
    avg_salary: 110000,
    growth_rate: "+20% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=product%20management", // Same product management learning path :contentReference[oaicite:21]{index=21}
  },
  {
    title: "Growth PM",
    description: "Experiments, funnels, and data‑driven growth loops.",
    industry: "Product",
    avg_salary: 95000,
    growth_rate: "+25% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=growth%20marketing", // Growth marketing educational links :contentReference[oaicite:22]{index=22}
  },
  {
    title: "Growth Marketer",
    description: "A/B tests, paid channels, and acquisition flywheels.",
    industry: "Marketing",
    avg_salary: 65000,
    growth_rate: "+10% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=digital%20marketing", // Digital marketing courses :contentReference[oaicite:23]{index=23}
  },
  {
    title: "SEO Specialist",
    description: "Technical SEO, content strategy, and organic growth.",
    industry: "Marketing",
    avg_salary: 60000,
        growth_rate: "+5% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://www.semrush.com/academy/courses/seo-fundamentals-course", // SEO fundamentals ([semrush.com](https://www.semrush.com/academy/courses/seo-fundamentals-course))
  },
  {
    title: "Content Marketer",
    description: "Long-form content, social, and brand storytelling.",
    industry: "Marketing",
    avg_salary: 55000,
    growth_rate: "+8% over 5 years",
    difficulty: "Beginner",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=content%20marketing", // Content marketing courses ([coursera.org](https://www.coursera.org/courses?query=content+marketing))
  },
  {
    title: "Fintech Analyst",
    description: "Financial modeling, payments, and fintech products.",
    industry: "Finance",
    avg_salary: 95000,
    growth_rate: "+18% over 5 years",
    difficulty: "Intermediate",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=financial%20analysis", // Finance & fintech courses ([coursera.org](https://www.coursera.org/courses?query=financial+analysis))
  },
  {
    title: "Quantitative Analyst",
    description: "Math-heavy modeling for trading and risk analysis.",
    industry: "Finance",
    avg_salary: 130000,
    growth_rate: "+20% over 5 years",
    difficulty: "Advanced",
    tags: [],
    sponsorship_link: "https://www.coursera.org/courses?query=quantitative%20finance", // Quant finance & modeling ([coursera.org](https://www.coursera.org/courses?query=quantitative+finance))
  },
];

Career.bulkCreate(careers)
  .then(() => {
    console.log("Careers created successfully!");
  })
  .catch((error) => {
    console.error("Error creating careers:", error.message);
  });