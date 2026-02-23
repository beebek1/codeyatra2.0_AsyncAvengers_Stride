import React, { useState, useEffect, useMemo } from "react";
import {
  Monitor, Server, Layers, Smartphone, Link, Cloud, Shield, Bug, Brain, Database, LineChart, Compass, PenTool,
  Clapperboard, Rocket, Search, FileText,
  CreditCard, TrendingUp, RefreshCcw, ChevronDown, Check, ArrowRight, X, SlidersHorizontal, RotateCcw
} from "lucide-react";

import { 
  Cpu, Terminal, BarChart3, Palette, 
  Target, Megaphone, Landmark, Box 
} from 'lucide-react';


const INDUSTRY_ICONS = {
  "Engineering": Terminal,
  "Data & AI": Cpu,
  "Design": Palette,
  "Product": Target,
  "Marketing": Megaphone,
  "Finance": Landmark,
  "Other": Box
};
/* ── DATA ── */
const CAREERS = [
  { id: "frontend", title: "Frontend Developer", industry: "Engineering", avgSalary: "$85k - $145k", growthRate: 15, difficulty: "Beginner Friendly", icon: Monitor, description: "Build beautiful UIs with React, CSS, and modern tooling." },
  { id: "backend", title: "Backend Developer", industry: "Engineering", avgSalary: "$95k - $160k", growthRate: 12, difficulty: "Intermediate", icon: Server, description: "Design APIs, manage databases, and power server-side logic." },
  { id: "fullstack", title: "Full Stack Developer", industry: "Engineering", avgSalary: "$100k - $180k", growthRate: 18, difficulty: "Intermediate", icon: Layers, description: "Own the entire stack from UI to database and deployment." },
  { id: "devops", title: "DevOps Engineer", industry: "Engineering", avgSalary: "$110k - $175k", growthRate: 21, difficulty: "Intermediate", icon: Cloud, description: "CI/CD, containers, cloud infra — keep systems running." },
  { id: "mobile", title: "Mobile Developer", industry: "Engineering", avgSalary: "$90k - $155k", growthRate: 10, difficulty: "Intermediate", icon: Smartphone, description: "Ship iOS and Android apps with React Native or Swift/Kotlin." },
  { id: "blockchain", title: "Blockchain Developer", industry: "Engineering", avgSalary: "$120k - $200k", growthRate: 25, difficulty: "Advanced", icon: Link, description: "Smart contracts, DeFi, and decentralized applications." },
  { id: "cloud", title: "Cloud Engineer", industry: "Engineering", avgSalary: "$105k - $170k", growthRate: 19, difficulty: "Intermediate", icon: Cloud, description: "AWS, GCP, or Azure — architect scalable cloud solutions." },
  { id: "security", title: "Cybersecurity Engineer", industry: "Engineering", avgSalary: "$115k - $190k", growthRate: 28, difficulty: "Advanced", icon: Shield, description: "Protect systems, conduct pen tests, and secure pipelines." },
  { id: "embedded", title: "Embedded Systems", industry: "Engineering", avgSalary: "$95k - $150k", growthRate: 7, difficulty: "Advanced", icon: Cpu, description: "Low-level C/C++ for hardware, IoT, and real-time systems." },
  { id: "qa", title: "QA / Test Engineer", industry: "Engineering", avgSalary: "$70k - $120k", growthRate: 8, difficulty: "Beginner Friendly", icon: Bug, description: "Automated testing, quality assurance, and bug hunting." },
  { id: "datascience", title: "Data Scientist", industry: "Data & AI", avgSalary: "$110k - $185k", growthRate: 22, difficulty: "Intermediate", icon: BarChart3, description: "Stats, ML models, and storytelling through data." },
  { id: "mleng", title: "ML Engineer", industry: "Data & AI", avgSalary: "$130k - $210k", growthRate: 32, difficulty: "Advanced", icon: Brain, description: "Deploy and scale machine learning models in production." },
  { id: "aieng", title: "AI Engineer", industry: "Data & AI", avgSalary: "$125k - $200k", growthRate: 45, difficulty: "Intermediate", icon: Brain, description: "LLMs, RAG pipelines, and AI-powered product engineering." },
  { id: "dataeng", title: "Data Engineer", industry: "Data & AI", avgSalary: "$110k - $175k", growthRate: 20, difficulty: "Intermediate", icon: Database, description: "ETL pipelines, warehouses, and big data infrastructure." },
  { id: "dataanalyst", title: "Data Analyst", industry: "Data & AI", avgSalary: "$65k - $110k", growthRate: 15, difficulty: "Beginner Friendly", icon: LineChart, description: "SQL, dashboards, and actionable business insights." },
  { id: "uxdesign", title: "UX Designer", industry: "Design", avgSalary: "$80k - $140k", growthRate: 12, difficulty: "Beginner Friendly", icon: Compass, description: "User research, wireframes, and end-to-end experiences." },
  { id: "uidesign", title: "UI Designer", industry: "Design", avgSalary: "$75k - $130k", growthRate: 10, difficulty: "Beginner Friendly", icon: Palette, description: "Figma, design systems, and pixel-perfect visual craft." },
  { id: "productdesign", title: "Product Designer", industry: "Design", avgSalary: "$95k - $160k", growthRate: 14, difficulty: "Intermediate", icon: PenTool, description: "Strategy + craft: shape the full product experience." },
  { id: "motion", title: "Motion Designer", industry: "Design", avgSalary: "$70k - $125k", growthRate: 8, difficulty: "Intermediate", icon: Clapperboard, description: "After Effects, Lottie, and bringing interfaces to life." },
  { id: "pm", title: "Product Manager", industry: "Product", avgSalary: "$100k - $170k", growthRate: 16, difficulty: "Intermediate", icon: Target, description: "Define roadmaps, align teams, and ship products." },
  { id: "apm", title: "Technical PM", industry: "Product", avgSalary: "$115k - $185k", growthRate: 14, difficulty: "Intermediate", icon: Brain, description: "Bridge engineering and business with technical fluency." },
  { id: "growthpm", title: "Growth PM", industry: "Product", avgSalary: "$105k - $165k", growthRate: 20, difficulty: "Intermediate", icon: Rocket, description: "Experiments, funnels, and data-driven growth loops." },
  { id: "growth", title: "Growth Marketer", industry: "Marketing", avgSalary: "$70k - $130k", growthRate: 12, difficulty: "Beginner Friendly", icon: Megaphone, description: "A/B tests, paid channels, and acquisition flywheels." },
  { id: "seo", title: "SEO Specialist", industry: "Marketing", avgSalary: "$60k - $110k", growthRate: 6, difficulty: "Beginner Friendly", icon: Search, description: "Technical SEO, content strategy, and organic growth." },
  { id: "contentmkt", title: "Content Marketer", industry: "Marketing", avgSalary: "$55k - $100k", growthRate: 5, difficulty: "Beginner Friendly", icon: FileText, description: "Long-form content, social, and brand storytelling." },
  { id: "fintech", title: "Fintech Analyst", industry: "Finance", avgSalary: "$90k - $150k", growthRate: 11, difficulty: "Intermediate", icon: CreditCard, description: "Financial modeling, payments, and fintech products." },
  { id: "quant", title: "Quantitative Analyst", industry: "Finance", avgSalary: "$150k - $300k+", growthRate: 9, difficulty: "Advanced", icon: TrendingUp, description: "Math-heavy modeling for trading and risk analysis." },
  { id: "techwrite", title: "Technical Writer", industry: "Other", avgSalary: "$75k - $125k", growthRate: 10, difficulty: "Beginner Friendly", icon: FileText, description: "Docs, API references, and developer education content." },
  { id: "scrum", title: "Scrum Master", industry: "Other", avgSalary: "$85k - $140k", growthRate: 13, difficulty: "Beginner Friendly", icon: RefreshCcw, description: "Ceremonies, retrospectives, and agile team coaching." }
];

const CATEGORIES = ["All","Engineering","Data & AI","Design","Product","Marketing","Finance","Other"];
const LEVELS     = ["All Levels","Beginner Friendly","Intermediate","Advanced"];

const LEVEL_STYLE = {
  "Beginner Friendly": { pill:"bg-emerald-50 text-emerald-700 border border-emerald-200" },
  "Intermediate":      { pill:"bg-amber-50 text-amber-700 border border-amber-200"       },
  "Advanced":          { pill:"bg-red-50 text-red-700 border border-red-200"             },
};

const CAT_ACCENT = {
  "Engineering": { bg:"bg-blue-50",   text:"text-blue-500",   ring:"ring-blue-100"   },
  "Data & AI":   { bg:"bg-green-50",  text:"text-green-600",  ring:"ring-green-100"  },
  "Design":      { bg:"bg-purple-50", text:"text-purple-500", ring:"ring-purple-100" },
  "Product":     { bg:"bg-yellow-50", text:"text-yellow-600", ring:"ring-yellow-100" },
  "Marketing":   { bg:"bg-orange-50", text:"text-orange-500", ring:"ring-orange-100" },
  "Finance":     { bg:"bg-teal-50",   text:"text-teal-600",   ring:"ring-teal-100"   },
  "Other":       { bg:"bg-gray-100",  text:"text-gray-500",   ring:"ring-gray-100"   },
};

const INITIAL = 6;
const FADE_PEEK = 3;

/* ── PAGE ── */
export default function CareersPage() {
  const [mounted,  setMounted]  = useState(false);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [level,    setLevel]    = useState("All Levels");
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);
  useEffect(() => { setExpanded(false); }, [search, category, level]);

  const filtered = useMemo(() => CAREERS.filter(c => {
    if (category !== "All" && c.category !== category) return false;
    if (level !== "All Levels" && c.level !== level)   return false;
    const q = search.toLowerCase();
    return !q || c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  }), [search, category, level]);

  const needsMore   = !expanded && filtered.length > INITIAL;
  const solidCards  = needsMore ? filtered.slice(0, INITIAL) : filtered;
  const fadedCards  = needsMore ? filtered.slice(INITIAL, INITIAL + FADE_PEEK) : [];
  const hiddenCount = filtered.length - INITIAL;
  const selCareer   = CAREERS.find(c => c.id === selected);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .font-syne { font-family: 'Syne', sans-serif !important; }
        .fade-up { opacity:0; transform:translateY(16px); transition:opacity .55s ease, transform .55s ease; }
        .fade-up.vis { opacity:1; transform:translateY(0); }
        @keyframes rippleOut {
          0%   { transform: scale(1);  opacity: 1; }
          100% { transform: scale(28); opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateX(-6px); }
          to   { opacity:1; transform:translateX(0); }
        }
      `}</style>

      <div className="min-h-screen bg-[#f9fafb]">

        <div className="max-w-6xl mx-auto px-5">

          {/* HERO */}
          <div className={`fade-up ${mounted ? "vis" : ""} pt-14 pb-10 text-center`}>
            <h1 
              className="font-black text-[#0E0E0E] tracking-tight leading-[1.15] mb-6" 
              style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)" }}
            >
              Pick your path.<br />
              <span className="relative inline-block mt-2">
                <span className="text-[#aaa] font-bold">We'll map the rest.</span>
                {/* Decorative Underline SVG */}
                <svg 
                  className="absolute -bottom-3 left-0 w-full h-[15px] pointer-events-none" 
                  viewBox="0 0 300 20" 
                  preserveAspectRatio="none" 
                  fill="none"
                >
                  <path 
                    d="M5 15C50 5 150 5 295 15" 
                    stroke="#F5C842" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    className="path-draw"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-[16px] text-[#999] max-w-md mx-auto leading-relaxed">
              Every career comes with a week-by-week AI roadmap, a Fit Score, and a Kanban board — ready to start today.
            </p>

            <style>{`
              @keyframes draw {
                to { stroke-dashoffset: 0; }
              }
              .path-draw {
                stroke-dasharray: 300;
                stroke-dashoffset: 300;
                animation: draw 1.2s ease-out forwards;
                animation-delay: 0.8s;
              }
            `}</style>
          </div>

          {/* FILTERS */}
          <div className={`fade-up ${mounted ? "vis" : ""} mb-8 relative z-50`} style={{ transitionDelay: "80ms" }}>
            <div className="flex gap-3 mb-4 relative">
              {/* Search Input Container */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none" />
                <input
                  className="w-full bg-white border border-black/[0.08] rounded-2xl pl-11 pr-4 py-3 text-[13.5px] font-medium text-[#0E0E0E] placeholder:text-[#C8C8C8] outline-none focus:border-[#0E0E0E] focus:ring-2 focus:ring-black/5 transition-all"
                  placeholder="Search careers, skills, roles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Filter Wrapper */}
              <div 
                className="relative"
                onMouseEnter={() => setShowFilters(true)}
                onMouseLeave={() => setShowFilters(false)}
              >
                <button 
                  className={`flex items-center gap-2 px-5 h-[48px] rounded-2xl border transition-all duration-300 font-bold text-[13px] cursor-pointer
                    ${showFilters 
                      ? "bg-[#0E0E0E] text-white border-[#0E0E0E] shadow-md" 
                      : "bg-white text-[#0E0E0E] border-black/[0.08] hover:bg-[#F2F2F2] hover:border-black/20"
                    }`}
                >
                  <SlidersHorizontal size={16} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                  <span>Filters</span>
                </button>

                {/* Pop-up Menu with Animation */}
                <div className={`
                  absolute right-0 top-[44px] pt-3 w-72 transition-all duration-300 ease-out z-50
                  ${showFilters 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-2 pointer-events-none"}
                `}> 
                  <div className="bg-white border border-black/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/5">
                      <h4 className="font-bold text-sm">Filter Options</h4>
                      <button 
                        onClick={() => { setCategory("All"); setLevel("All Levels"); }}
                        className="text-[10px] uppercase tracking-tighter font-bold text-[#999] hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Category Section */}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#999] font-bold mb-3">Category</p>
                        <div className="flex gap-2 flex-wrap">
                          {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setCategory(cat)}
                              className={`text-[11px] font-bold rounded-full px-3 py-1.5 border transition-all cursor-pointer
                                ${category === cat ? "bg-[#0E0E0E] text-white border-[#0E0E0E]" : "bg-white text-[#999] border-black/10 hover:border-black/40 hover:text-black"}`}>
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Level Section */}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#999] font-bold mb-3">Experience</p>
                        <div className="flex gap-2 flex-wrap">
                          {LEVELS.map(l => (
                            <button key={l} onClick={() => setLevel(l)}
                              className={`text-[11px] font-bold rounded-full px-3 py-1.5 border transition-all cursor-pointer
                                ${level === l ? "bg-[#F5C842] text-[#0E0E0E] border-[#F5C842]" : "bg-white text-[#999] border-black/10 hover:border-black/40 hover:text-black"}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRID + FADE OVERLAY */}
          <div className="relative pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {solidCards.map((career, i) => (
                <CareerCard
                  key={career.id} career={career}
                  selected={selected===career.id}
                  onSelect={() => setSelected(selected===career.id ? null : career.id)}
                  animDelay={i*50} faded={false}
                />
              ))}

              {fadedCards.map((career, i) => (
                <div key={career.id} style={{
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
                }}>
                  <CareerCard
                    career={career}
                    selected={false} onSelect={null}
                    animDelay={0} faded={true}
                  />
                </div>
              ))}
            </div>

            {/* Fade + See More */}
            {needsMore && (
              <>
                {/* Gradient anchored to TOP of faded row, fades downward */}
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: "calc(100% - 260px - 52px)", /* starts at top of faded card row */
                    height: 280,
                    background: "linear-gradient(to bottom, rgba(242,241,239,0.0) 0%, rgba(242,241,239,0.45) 30%, rgba(242,241,239,0.85) 58%, #f9fafb 78%, #f9fafb 100%)",
                  }}
                />
                {/* Button sits below */}
                <div className="flex justify-center mt-4 relative z-10">
                  <button
                    onClick={() => setExpanded(true)}
                    className="flex cursor-pointer items-center gap-2 bg-[#1e1e1e] hover:bg-[#3c3c3c] active:scale-95 text-white text-[13px] font-bold rounded-full px-7 py-3.5 shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5"
                  >
                    <ChevronDown size={15} />
                    See {hiddenCount} more career{hiddenCount!==1?"s":""}
                  </button>
                </div>
              </>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-sm font-semibold text-[#bbb] mb-3">No careers match your filters.</p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); setLevel("All Levels"); }}
                  className="cursor-pointer text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Clear all filters →
                </button>
              </div>
            )}
          </div>

          <div className="h-28" />
        </div>

        {/* FLOATING BAR */}
        <div
          className="fixed bottom-10 left-1/2 z-50 w-auto max-w-[95vw] cursor-pointer"
          style={{
            transform: selected ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(120px)",
            opacity: selected ? 1 : 0,
            pointerEvents: selected ? "all" : "none",
            transition: "transform .6s cubic-bezier(.34,1.56,.64,1), opacity .3s ease",
          }}
        >
          {/* The Ambient Halo */}
          <div className="absolute inset-0 bg-[#F5C842]/15 blur-2xl -z-10 rounded-full animate-pulse" />

          <div className="relative flex items-center gap-8 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-[2rem] pl-8 pr-3 py-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/5">
            
            {/* Section 1: Dynamic Label */}
            <div className="flex flex-col min-w-[140px]">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] text-[#F5C842] font-black uppercase tracking-[0.2em]">
                  Selected Path
                </span>
              </div>
              <h4 className="text-[15px] font-bold text-white tracking-tight leading-tight">
                {selCareer?.title}
              </h4>
            </div>

            {/* Section 2: Stats (Simplified) */}
            <div className="hidden sm:flex items-center gap-8 px-8 border-l border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-0.5">Market Pay</span>
                <span className="text-[12px] text-white/90 font-medium">{selCareer?.avgSalary}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-0.5">Trend</span>
                <span className="text-[12px] text-[#22C55E] font-bold">+{selCareer?.growthRate}%</span>
              </div>
            </div>

            {/* Section 3: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Shortened punchy CTA */}
              <button 
                
                className="group flex items-center gap-2 bg-[#F5C842] hover:bg-[#FFD84D] text-[#1A1A1A] text-[13px] font-black rounded-full px-8 py-3.5 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer shadow-lg shadow-[#F5C842]/10">
                Start Journey
                <ArrowRight size={16} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setSelected(null)}
                className="w-11 h-11 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

/* ── CARD ── */
function CareerCard({ career, selected, onSelect, animDelay, faded }) {
  const [hovered, setHovered] = useState(false);
  
  const Icon = INDUSTRY_ICONS[career.industry] || INDUSTRY_ICONS["Other"];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => !faded && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500
        ${faded ? "pointer-events-none opacity-40" : "cursor-pointer"}
        ${selected 
          ? "border-[#F5C842] shadow-[0_20px_40px_rgba(245,200,66,0.15)] -translate-y-2" 
          : "border-black/[0.04] hover:border-black/[0.1] shadow-sm hover:shadow-xl hover:-translate-y-1"
        }
        border-2
      `}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Subtle background glow when selected */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5C842]/5 to-transparent pointer-events-none" />
      )}

      <div className="relative p-7 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
            ${selected 
              ? "bg-[#F5C842] text-white shadow-[0_8px_20px_rgba(245,200,66,0.3)]" 
              : "bg-[#FBFBF9] text-[#A0A090] group-hover:bg-[#F5C842]/10 group-hover:text-[#F5C842]"
            }`}
          >
            <Icon size={22} strokeWidth={2.5} />
          </div>

          <span className={`
            text-[10px] font-bold px-3 py-1 rounded-full tracking-tight transition-all
            ${selected ? "bg-[#F5C842] text-white" : "bg-[#F5F5F3] text-[#999]"}
          `}>
            {career.industry}
          </span>
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <h3 className={`text-[16px] font-bold tracking-tight transition-colors ${selected ? 'text-[#0E0E0E]' : 'text-[#333]'}`}>
            {career.title}
          </h3>
          <p className="text-[12.5px] text-[#999] leading-relaxed line-clamp-2 mt-1">
            {career.description}
          </p>
        </div>

        {/* Stats Grid - No more black! Using soft neutrals and yellow accents */}
        <div className={`
          grid grid-cols-2 gap-4 p-4 rounded-2xl transition-all duration-500
          ${selected 
            ? "bg-[#F5C842]/5 border-[#F5C842]/20 shadow-inner" 
            : "bg-[#F9F9F8] border-transparent"
          }
          border
        `}>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest mb-1 text-[#AAA]">Avg Salary</p>
            <p className={`text-[14px] font-bold ${selected ? 'text-[#C8980A]' : 'text-[#444]'}`}>
              {career.avgSalary}
            </p>
          </div>
          <div className={`pl-4 border-l ${selected ? 'border-[#F5C842]/20' : 'border-black/5'}`}>
            <p className="text-[9px] uppercase font-bold tracking-widest mb-1 text-[#AAA]">Growth</p>
            <p className="text-[14px] font-bold text-[#22C55E]">
              +{career.growthRate}%
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-[#F5C842] animate-pulse' : 'bg-[#DDD]'}`} />
            <span className={`text-[10px] font-bold ${selected ? 'text-[#0E0E0E]' : 'text-[#AAA]'}`}>
              {career.difficulty}
            </span>
          </div>

          {/* Start Button - Subtle text link instead of dark button */}
          <div className={`
            flex items-center gap-1 transition-all duration-300
            ${selected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
          `}>
            <span className="text-[11px] font-bold text-[#F5C842]">Explore</span>
            <ArrowRight size={14} className="text-[#F5C842]" strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
}