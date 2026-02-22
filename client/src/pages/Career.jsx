import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Monitor, Server, Layers, Smartphone, Link, Cloud, Shield, Cpu, Bug,
  BarChart3, Brain, Database, LineChart, Compass, Palette, PenTool,
  Clapperboard, Target, Rocket, Megaphone, Search, FileText,
  CreditCard, TrendingUp, RefreshCcw, ChevronDown, Check, ArrowRight, X
} from "lucide-react";
import { Code, Laptop, BarChart, Lock, Box, User } from 'lucide-react';
import { getAllCareers } from "../services/api";

const CATEGORIES = ["All","Engineering","Data & AI","Design","Product","Marketing","Finance","Other"];

// BUG 1 FIX: Your LEVELS had "Beginner Friendly" but the API sends "Beginner".
// Changed to match exact API difficulty values so the level filter actually works.
const LEVELS = ["All Levels","Beginner","Intermediate","Advanced"];

const LEVEL_STYLE = {
  // BUG 1 FIX (continued): Keys now match API values "Beginner"/"Intermediate"/"Advanced"
  // Your original had "Beginner Friendly" which never matched anything from the API.
  "Beginner":     { pill:"bg-emerald-50 text-emerald-700 border border-emerald-200" },
  "Intermediate": { pill:"bg-amber-50 text-amber-700 border border-amber-200"       },
  "Advanced":     { pill:"bg-red-50 text-red-700 border border-red-200"             },
};

const icons = {
  Engineering: Monitor,
  Design: Laptop,
  "Data & AI": BarChart,
  Finance: Cloud,
  Product: Box,
  Marketing: FileText,
  "Data Analyst": BarChart,
  "UX Designer": User,
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
  const navigate = useNavigate();
  const [mounted,  setMounted]  = useState(false);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [level,    setLevel]    = useState("All Levels");
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [careers,  setCareers]  = useState([]);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);
  useEffect(() => { setExpanded(false); }, [search, category, level]);

  useEffect(() => {
    const getCareersFromApi = async () => {
      try {
        const response = await getAllCareers();
        if (response.data.success) {
          const careersFromApi = response.data.data.map(c => ({
            id: c.id,
            label: c.title,
            category: c.industry,
            // BUG 2 FIX: c.tags is an array from the API (e.g. ["Popular"] or ["🔥 Hot"] or []).
            // Your original code did c.tags[0] which is correct BUT then used career.tag?.includes("🔥")
            // which calls String.includes() — that only works if tag is already a string.
            // c.tags[0] IS a string so this actually works, but c.tags can be [] giving undefined.
            // The fix: keep c.tags[0] (string or undefined), which is safe for both tag checks below.
            tag: c.tags.length > 0 ? c.tags[0] : null,
            weeks: 16,
            level: c.difficulty,  // API sends "Beginner" | "Intermediate" | "Advanced" — matches LEVELS now
            icon: icons[c.industry] || Monitor,
            desc: c.description,
          }));
          setCareers(careersFromApi);
        } else {
          console.error("Failed to fetch careers:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching careers:", error.message);
      }
    };

    getCareersFromApi();
  }, []);

  const filtered = useMemo(() => careers.filter(c => {
    if (category !== "All" && c.category !== category) return false;
    if (level !== "All Levels" && c.level !== level)   return false;
    const q = search.toLowerCase();
    return !q || c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  // BUG 3 FIX: `careers` was missing from the dependency array.
  // Without it, useMemo runs once on mount when careers=[] and never re-runs
  // after the API call populates it — so filtered was always empty.
  }), [search, category, level, careers]);

  const needsMore   = !expanded && filtered.length > INITIAL;
  const solidCards  = needsMore ? filtered.slice(0, INITIAL) : filtered;
  const fadedCards  = needsMore ? filtered.slice(INITIAL, INITIAL + FADE_PEEK) : [];
  const hiddenCount = filtered.length - INITIAL;
  const selCareer   = careers.find(c => c.id === selected);

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
          <div className={`fade-up ${mounted?"vis":""} mb-8`} style={{transitionDelay:"80ms"}}>
            <div className="relative mb-4">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none" />
              <input
                className="w-full bg-white border border-black/[0.08] rounded-2xl pl-11 pr-4 py-3 text-[13.5px] font-medium text-[#0E0E0E] placeholder:text-[#C8C8C8] outline-none focus:border-[#0E0E0E] focus:ring-2 focus:ring-black/5 transition-all"
                placeholder="Search careers, skills, roles…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap mb-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`text-xs font-bold rounded-full px-4 py-1.5 border transition-all whitespace-nowrap
                    ${category===cat ? "bg-[#0E0E0E] text-white border-[#0E0E0E]" : "bg-white text-[#999] border-black/10 hover:border-[#888] hover:text-[#333]"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`text-[11px] font-bold rounded-full px-4 py-1.5 border transition-all whitespace-nowrap
                    ${level===l ? "bg-[#F5C842] text-[#0E0E0E] border-[#F5C842]" : "bg-white text-[#999] border-black/10 hover:border-[#888] hover:text-[#333]"}`}>
                  {/* Show "Beginner Friendly" label in UI even though the filter value is "Beginner" */}
                  {l === "Beginner" ? "Beginner Friendly" : l}
                </button>
              ))}
            </div>
          </div>

          {/* META */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-semibold text-[#C0C0C0]">{filtered.length} career{filtered.length!==1?"s":""}</span>
            {selCareer && <span className="text-xs font-bold text-amber-600">✓ {selCareer.label} selected</span>}
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
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: "calc(100% - 260px - 52px)",
                    height: 280,
                    background: "linear-gradient(to bottom, rgba(242,241,239,0.0) 0%, rgba(242,241,239,0.45) 30%, rgba(242,241,239,0.85) 58%, #f9fafb 78%, #f9fafb 100%)",
                  }}
                />
                <div className="flex justify-center mt-4 relative z-10">
                  <button
                    onClick={() => setExpanded(true)}
                    className="flex items-center gap-2 bg-[#0E0E0E] hover:bg-[#222] active:scale-95 text-white text-[13px] font-bold rounded-full px-7 py-3.5 shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5"
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
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
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
          className="fixed bottom-7 left-1/2 z-50"
          style={{
            transform: selected ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(90px)",
            opacity: selected ? 1 : 0,
            pointerEvents: selected ? "all" : "none",
            transition: "transform .42s cubic-bezier(.34,1.56,.64,1), opacity .28s ease",
          }}
        >
          <div className="flex items-center gap-3 bg-[#0E0E0E] rounded-full pl-5 pr-2.5 py-2.5 shadow-2xl shadow-black/30 border border-white/[0.05] whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-[#F5C842] shrink-0" />
            <span className="text-[13px] font-bold text-white">{selCareer?.label}</span>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[11px] text-[#555] font-semibold">~{selCareer?.weeks} weeks</span>
            <button
              onClick={() => navigate(`/roadmap`, { state: { careerId: selCareer?.id, careerLabel: selCareer?.label } })}
              className="flex items-center gap-1.5 bg-[#F5C842] hover:bg-[#e8b800] text-[#0E0E0E] text-[13px] font-black rounded-full px-5 py-2.5 transition-colors">
              Start Roadmap <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setSelected(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#555] hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

/* ── CARD ── */
function CareerCard({ career, selected, onSelect, animDelay, faded }) {
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [checkPop, setCheckPop] = useState(false);
  const lvl = LEVEL_STYLE[career.level];
  const cat = CAT_ACCENT[career.category] || CAT_ACCENT["Other"];
  const Icon = career.icon;

  const PHASES = ["Basics", "Intermediate", "Portfolio", "Job Ready"];

  function handleClick(e) {
    if (faded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(r => r.id !== id)), 700);
    if (!selected) {
      setCheckPop(true);
      setTimeout(() => setCheckPop(false), 400);
    }
    onSelect();
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => !faded && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative bg-white rounded-2xl overflow-hidden border-2
        ${faded ? "pointer-events-none" : "cursor-pointer"}
        ${!faded && selected
          ? "border-[#F5C842] -translate-y-2 shadow-[0_0_0_5px_rgba(245,200,66,0.16),0_20px_50px_rgba(0,0,0,0.13)]"
          : !faded && hovered
            ? "border-[#0E0E0E] -translate-y-1 shadow-[0_10px_32px_rgba(0,0,0,0.11)]"
            : "border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_14px_rgba(0,0,0,0.04)]"
        }
      `}
      style={{
        animationDelay:`${animDelay}ms`,
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.2s ease",
      }}
    >
      {/* Ripple effects */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: r.x, top: r.y,
            width: 8, height: 8,
            marginLeft: -4, marginTop: -4,
            background: selected ? "rgba(14,14,14,0.08)" : "rgba(245,200,66,0.35)",
            animation: "rippleOut 0.65s ease-out forwards",
          }}
        />
      ))}

      {/* Selected accent bar — slides in */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F5C842] via-[#FFD84D] to-transparent z-10"
        style={{
          transform: selected ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />

      {/* Background tint on select */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(245,200,66,0.04) 0%, transparent 60%)",
          opacity: selected ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <div className="relative p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon — scales and changes bg on select */}
          <div
            style={{
              background: selected ? "#F5C842" : undefined,
              transition: "background 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
              transform: selected ? "scale(1.1)" : hovered ? "scale(1.05)" : "scale(1)",
              boxShadow: selected ? "0 4px 14px rgba(245,200,66,0.4)" : "none",
            }}
            className={`w-11 h-11 rounded-[14px] flex items-center justify-center ring-4 ${selected ? "ring-[#F5C842]/20" : cat.ring} ${selected ? "" : cat.bg}`}
          >
            <Icon
              size={20} strokeWidth={1.8}
              className={selected ? "text-[#0E0E0E]" : cat.text}
              style={{ transition: "color 0.2s ease" }}
            />
          </div>

          {/* Tags + check */}
          <div className="flex flex-col items-end gap-1.5">
            {career.tag?.includes("🔥") && (
              <span className="text-[9px] font-black tracking-wide uppercase rounded-full px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-200">🔥 Hot</span>
            )}
            {career.tag === "Popular" && (
              <span className="text-[9px] font-black tracking-wide uppercase rounded-full px-2.5 py-1 bg-violet-50 text-violet-600 border border-violet-200">Popular</span>
            )}
            {/* Animated check badge */}
            <div
              style={{
                width: 22, height: 22,
                borderRadius: "50%",
                background: selected ? "#0E0E0E" : hovered ? "#0E0E0E" : "#F0F0EE",
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: checkPop ? "scale(1.4)" : selected ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease",
              }}
            >
              {selected
                ? <Check size={11} color="#F5C842" strokeWidth={3} />
                : <ArrowRight size={10} color={hovered ? "#fff" : "#ccc"} strokeWidth={2} />
              }
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[14.5px] font-black text-[#0E0E0E] tracking-tight leading-snug mb-1.5">
          {career.label}
        </h3>

        {/* Desc */}
        <p className="text-[12px] text-[#999] leading-relaxed mb-4 line-clamp-2">{career.desc}</p>

        {/* Expandable roadmap phases — slides open on select */}
        <div
          style={{
            maxHeight: selected ? 80 : 0,
            opacity: selected ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
            marginBottom: selected ? 14 : 0,
          }}
        >
          <div className="flex items-center gap-1.5 pt-1 pb-3">
            {PHASES.map((phase, i) => (
              <React.Fragment key={phase}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: i === 0 ? "#F5C842" : "#E5E5E5",
                      transform: selected ? "scale(1)" : "scale(0)",
                      transition: `transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`,
                    }}
                  />
                  <span className="text-[9px] font-bold text-[#bbb] whitespace-nowrap">{phase}</span>
                </div>
                {i < PHASES.length - 1 && (
                  <div
                    className="h-px bg-[#E8E8E8] flex-1"
                    style={{
                      transform: selected ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                      transition: `transform 0.3s ease ${i * 60 + 80}ms`,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold rounded-full px-2.5 py-1"
              style={{
                background: selected ? "#0E0E0E" : "#F5F5F3",
                color: selected ? "#F5C842" : "#bbb",
                transition: "background 0.25s ease, color 0.25s ease",
              }}
            >
              ~{career.weeks}w
            </span>
            {/* Level pill commented out as in your original */}
            {/* <span className={`text-[9.5px] font-black rounded-full px-2.5 py-1 ${lvl.pill}`}>
              {career.level === "Beginner Friendly" ? "Beginner" : career.level}
            </span> */}
          </div>

          {/* "Start" text appears on select */}
          {selected && (
            <span
              className="text-[10px] font-black text-[#C8980A] tracking-wide"
              style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
            >
              Ready to start →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}