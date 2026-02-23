import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

// Icons with high-contrast strokes for better visibility
const careerIcons = [
  { label: "Engineering", color: "#6366f1", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 2 8 8a4 4 0 1 0 5.66 5.66L14 8l-8-8Z"/><path d="m2 8 8 8a4 4 0 0 0 5.66 5.66L8 14l-8-8Z"/></svg> },
  { label: "Data Science", color: "#06b6d4", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
  { label: "Design", color: "#ec4899", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> },
];

const roadmapSteps = [
  { time: "Week 1", task: "Analyze Skills & Set Target Score", status: "complete" },
  { time: "Week 2-4", task: "Master Core Industry Prerequisites", status: "active" },
  { time: "Month 2", task: "Build AI-Validated Portfolio Project", status: "pending" },
  { time: "Month 3", task: "Direct Outreach & Interview Prep", status: "pending" },
];

export default function EnhancedDashboard() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [iconIdx, setIconIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setIconIdx((prev) => (prev + 1) % careerIcons.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] selection:bg-[#F5C842]/30">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Copy & Actions */}
        <div className={`opacity-0 animate-reveal`} style={{ animationDelay: '0.1s' }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">AI Engine Live v2.0</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Your career <br />
            <span className="text-gray-400">is no longer</span> <br />
            <span className="relative">
              guesswork.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none"><path d="M5 15C50 5 150 5 295 15" stroke="#F5C842" strokeWidth="4" strokeLinecap="round"/></svg>
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
            Stop following generic advice. CareerForge AI maps your unique skills to the world's most in-demand roles and builds a <span className="text-black font-semibold">bespoke Kanban roadmap</span> to get you hired.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate("/roadmap")}
              className="flex items-center gap-2 cursor-pointer bg-[#111827] text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              Resume Learning
              <Play className=" h-5 w-5"/>
              
            </button>
            <button 
              onClick={() => navigate("/careers")}
              className="cursor-pointer bg-white border border-gray-200 text-[#111827] px-8 py-4 rounded-xl font-bold hover:border-gray-400 transition-all active:scale-95"
            >
              Explore Paths
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-gray-400">
            <span className="flex -space-x-2">
              {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />)}
            </span>
            <span>Used by 2,000+ early-career pros</span>
          </div>
        </div>

        {/* Right Side: The "Product Preview" */}
        <div className={`opacity-0 animate-reveal relative`} style={{ animationDelay: '0.3s' }}>
          {/* Decorative Back Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#F5C842]/10 to-transparent rounded-full blur-3xl -z-10" />
          
          <div className="bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 p-8 relative overflow-hidden">
            {/* Mock Dashboard Header */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tighter">Roadmap Preview</h3>
                <p className="text-xs text-gray-400 font-medium">Updated 2m ago</p>
              </div>
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner"
                style={{ backgroundColor: `${careerIcons[iconIdx].color}20`, color: careerIcons[iconIdx].color }}
              >
                {careerIcons[iconIdx].icon}
              </div>
            </div>

            {/* Roadmap List */}
            <div className="space-y-4">
              {roadmapSteps.map((step, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    step.status === 'active' ? 'bg-[#F9FAFB] border-[#F5C842] shadow-sm' : 'border-transparent'
                  }`}
                >
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    step.status === 'complete' ? 'bg-green-500 border-green-500' : 
                    step.status === 'active' ? 'border-[#F5C842]' : 'border-gray-200'
                  }`}>
                    {step.status === 'complete' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17L4 12"/></svg>}
                    {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-[#F5C842] animate-pulse" />}
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${step.status === 'active' ? 'text-[#C8980A]' : 'text-gray-400'}`}>
                      {step.time}
                    </p>
                    <p className={`text-sm ${step.status === 'pending' ? 'text-gray-300' : 'font-semibold text-gray-900'}`}>
                      {step.task}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Float Stats Card */}
            <div className="absolute bottom-6 right-6 bg-white border border-gray-100 shadow-2xl p-4 rounded-2xl flex items-center gap-4 animate-bounce hover:pause">
              <div className="p-3 bg-green-50 rounded-xl">
                <span className="text-green-600 font-black text-xl">92%</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Market Fit</p>
                <p className="text-xs font-bold text-gray-900">High Match</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Validated against hiring data from</p>
          <div className="flex flex-wrap justify-center gap-8 grayscale opacity-40 hover:opacity-100 transition-opacity">
            {['Google', 'Airbnb', 'Stripe', 'Palantir', 'Discord'].map(brand => (
              <span key={brand} className="text-lg font-black tracking-tighter text-gray-900">{brand}</span>
            ))}
          </div>
        </div>
      </section>
      {/* Career Categories */}
      <section className="bg-[#0E0E0E] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] inline-block"></span> Browse by Field
          </p>
          <h2 className="text-6xl font-extrabold text-white mb-10">
            Pick your <span className="text-[#F5C842]">direction</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { emoji: "💻", name: "Technology", count: "18 tracks" },
              { emoji: "🎨", name: "Design",     count: "9 tracks"  },
              { emoji: "📊", name: "Data & AI",  count: "11 tracks" },
              { emoji: "📣", name: "Marketing",  count: "7 tracks"  },
              { emoji: "💰", name: "Finance",    count: "6 tracks"  },
              { emoji: "🧠", name: "Product",    count: "5 tracks"  },
            ].map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate("/careers")}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#F5C842] rounded-2xl p-6 cursor-pointer transition-all"
              >
                <div className="text-3xl mb-4">{cat.emoji}</div>
                <div className="text-white font-bold text-sm mb-1">{cat.name}</div>
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] inline-block"></span> Social Proof
          </p>
          <h2 className="text-4xl font-extrabold text-[#111827] mb-12 tracking-tight">What early users say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { initial: "A", name: "Aarav Mehta", role: "Junior Frontend Dev · Bangalore", quote: "Stride gave me a clear 12-week plan when I had no idea where to start. I landed my first dev role in 3 months." },
              { initial: "S", name: "Sara Kim",    role: "UX Designer · Seoul",             quote: "The roadmap felt like it was built specifically for me. The market match score kept me motivated every week." },
              { initial: "J", name: "James O.",    role: "Data Analyst · Lagos",            quote: "Finally, career advice backed by actual hiring data — not generic YouTube videos. This is the real deal." },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col gap-5 shadow-sm hover:border-[#F5C842] transition-all">
                <div className="text-[#F5C842] text-lg tracking-widest">★★★★★</div>
                <p className="text-gray-700 text-[15px] leading-relaxed font-medium">
                  <span className="text-[#F5C842] text-3xl font-serif leading-none mr-1">"</span>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-[#F5C842] flex items-center justify-center font-black text-sm text-black flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}