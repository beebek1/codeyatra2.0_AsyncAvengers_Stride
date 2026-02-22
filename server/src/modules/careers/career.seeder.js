import Career from "./career.model.js"; // Adjust path if necessary

const careers = [
  {
    "title": "Frontend Developer",
    "description": "Build beautiful UIs with React, CSS, and modern tooling.",
    "industry": "Engineering",
    "avg_salary": 70000,
    "growth_rate": "+10% over 5 years",
    "difficulty": "Beginner",
    "tags": ["Popular"]
  },
  {
    "title": "Backend Developer",
    "description": "Design APIs, manage databases, and power server-side logic.",
    "industry": "Engineering",
    "avg_salary": 80000,
    "growth_rate": "+15% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Full Stack Developer",
    "description": "Own the entire stack from UI to database and deployment.",
    "industry": "Engineering",
    "avg_salary": 90000,
    "growth_rate": "+20% over 5 years",
    "difficulty": "Intermediate",
    "tags": ["🔥 Hot"]
  },
  {
    "title": "DevOps Engineer",
    "description": "CI/CD, containers, cloud infra — keep systems running.",
    "industry": "Engineering",
    "avg_salary": 95000,
    "growth_rate": "+18% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Mobile Developer",
    "description": "Ship iOS and Android apps with React Native or Swift/Kotlin.",
    "industry": "Engineering",
    "avg_salary": 85000,
    "growth_rate": "+12% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Blockchain Developer",
    "description": "Smart contracts, DeFi, and decentralized applications.",
    "industry": "Engineering",
    "avg_salary": 120000,
    "growth_rate": "+30% over 5 years",
    "difficulty": "Advanced",
    "tags": []
  },
  {
    "title": "Cloud Engineer",
    "description": "AWS, GCP, or Azure — architect scalable cloud solutions.",
    "industry": "Engineering",
    "avg_salary": 100000,
    "growth_rate": "+25% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Cybersecurity Engineer",
    "description": "Protect systems, conduct pen tests, and secure pipelines.",
    "industry": "Engineering",
    "avg_salary": 110000,
    "growth_rate": "+15% over 5 years",
    "difficulty": "Advanced",
    "tags": []
  },
  {
    "title": "Embedded Systems",
    "description": "Low-level C/C++ for hardware, IoT, and real-time systems.",
    "industry": "Engineering",
    "avg_salary": 105000,
    "growth_rate": "+12% over 5 years",
    "difficulty": "Advanced",
    "tags": []
  },
  {
    "title": "QA / Test Engineer",
    "description": "Automated testing, quality assurance, and bug hunting.",
    "industry": "Engineering",
    "avg_salary": 60000,
    "growth_rate": "+8% over 5 years",
    "difficulty": "Beginner",
    "tags": []
  },
  {
    "title": "Data Scientist",
    "description": "Stats, ML models, and storytelling through data.",
    "industry": "Data & AI",
    "avg_salary": 110000,
    "growth_rate": "+18% over 5 years",
    "difficulty": "Intermediate",
    "tags": ["Popular"]
  },
  {
    "title": "ML Engineer",
    "description": "Deploy and scale machine learning models in production.",
    "industry": "Data & AI",
    "avg_salary": 120000,
    "growth_rate": "+20% over 5 years",
    "difficulty": "Advanced",
    "tags": ["🔥 Hot"]
  },
  {
    "title": "AI Engineer",
    "description": "LLMs, RAG pipelines, and AI-powered product engineering.",
    "industry": "Data & AI",
    "avg_salary": 115000,
    "growth_rate": "+22% over 5 years",
    "difficulty": "Intermediate",
    "tags": ["🔥 Hot"]
  },
  {
    "title": "Data Engineer",
    "description": "ETL pipelines, warehouses, and big data infrastructure.",
    "industry": "Data & AI",
    "avg_salary": 95000,
    "growth_rate": "+10% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Data Analyst",
    "description": "SQL, dashboards, and actionable business insights.",
    "industry": "Data & AI",
    "avg_salary": 65000,
    "growth_rate": "+8% over 5 years",
    "difficulty": "Beginner",
    "tags": []
  },
  {
    "title": "UX Designer",
    "description": "User research, wireframes, and end-to-end experiences.",
    "industry": "Design",
    "avg_salary": 75000,
    "growth_rate": "+15% over 5 years",
    "difficulty": "Beginner",
    "tags": ["Popular"]
  },
  {
    "title": "UI Designer",
    "description": "Figma, design systems, and pixel-perfect visual craft.",
    "industry": "Design",
    "avg_salary": 70000,
    "growth_rate": "+12% over 5 years",
    "difficulty": "Beginner",
    "tags": []
  },
  {
    "title": "Product Designer",
    "description": "Strategy + craft: shape the full product experience.",
    "industry": "Design",
    "avg_salary": 85000,
    "growth_rate": "+20% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Motion Designer",
    "description": "After Effects, Lottie, and bringing interfaces to life.",
    "industry": "Design",
    "avg_salary": 80000,
    "growth_rate": "+15% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Product Manager",
    "description": "Define roadmaps, align teams, and ship products.",
    "industry": "Product",
    "avg_salary": 105000,
    "growth_rate": "+18% over 5 years",
    "difficulty": "Intermediate",
    "tags": ["Popular"]
  },
  {
    "title": "Technical PM",
    "description": "Bridge engineering and business with technical fluency.",
    "industry": "Product",
    "avg_salary": 110000,
    "growth_rate": "+20% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Growth PM",
    "description": "Experiments, funnels, and data-driven growth loops.",
    "industry": "Product",
    "avg_salary": 95000,
    "growth_rate": "+25% over 5 years",
    "difficulty": "Intermediate",
    "tags": ["🔥 Hot"]
  },
  {
    "title": "Growth Marketer",
    "description": "A/B tests, paid channels, and acquisition flywheels.",
    "industry": "Marketing",
    "avg_salary": 65000,
    "growth_rate": "+10% over 5 years",
    "difficulty": "Beginner",
    "tags": []
  },
  {
    "title": "SEO Specialist",
    "description": "Technical SEO, content strategy, and organic growth.",
    "industry": "Marketing",
    "avg_salary": 60000,
    "growth_rate": "+5% over 5 years",
    "difficulty": "Beginner",
    "tags": []
  },
  {
    "title": "Content Marketer",
    "description": "Long-form content, social, and brand storytelling.",
    "industry": "Marketing",
    "avg_salary": 55000,
    "growth_rate": "+8% over 5 years",
    "difficulty": "Beginner",
    "tags": []
  },
  {
    "title": "Fintech Analyst",
    "description": "Financial modeling, payments, and fintech products.",
    "industry": "Finance",
    "avg_salary": 95000,
    "growth_rate": "+18% over 5 years",
    "difficulty": "Intermediate",
    "tags": []
  },
  {
    "title": "Quantitative Analyst",
    "description": "Math-heavy modeling for trading and risk analysis.",
    "industry": "Finance",
    "avg_salary": 130000,
    "growth_rate": "+20% over 5 years",
    "difficulty": "Advanced",
    "tags": ["Popular"]
  },
];

Career.bulkCreate(careers)
  .then(() => {
    console.log("Careers created successfully!");
  })
  .catch((error) => {
    console.error("Error creating careers:", error.message);
  });