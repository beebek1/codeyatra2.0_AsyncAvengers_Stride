import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const habits = [
  "Build a portfolio project",
  "Complete DSA review",
  "Mock interview session",
  "Read system design docs",
  "Push to GitHub daily",
];

export default function SignInGate() {
  const navigate = useNavigate();
  const [activeHabit, setActiveHabit] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveHabit((p) => (p + 1) % habits.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex items-center justify-center px-6">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes habitSlide {
          0%   { opacity: 0; transform: translateY(8px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .reveal-1 { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .reveal-2 { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .reveal-3 { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
        .reveal-4 { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.46s both; }
        .habit-text { animation: habitSlide 2s ease-in-out infinite; }
        .shimmer-btn {
          background: linear-gradient(90deg, #111827 40%, #3b3b3b 50%, #111827 60%);
          background-size: 200% auto;
        }
        .shimmer-btn:hover { animation: shimmer 1.2s linear infinite; }
      `}</style>

      <div className="w-full max-w-lg text-center">

        {/* Badge */}
        <div className="reveal-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Members Only</span>
        </div>

        {/* Heading — same scale + style as home h1 */}
        <h1 className="reveal-2 text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
          Sign in to start <br />
          <span className="text-gray-400">tracking your</span>{" "}
          <span className="relative inline-block">
            habits.
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
              <path d="M5 15C50 5 150 5 295 15" stroke="#F5C842" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>


        <p className="reveal-3 text-sm text-gray-400 mb-10">
          Built by <span className="font-semibold text-gray-700">Async Avengers</span>. Turning "I don't know" into "I'm on it."
        </p>

        {/* Cycling habit ticker */}
        <div className="reveal-3 mx-auto mb-8 max-w-sm bg-white border border-gray-200 rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-sm overflow-hidden" style={{ height: "48px" }}>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-shrink-0">Today:</span>
          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            <span key={activeHabit} className="habit-text text-sm font-semibold text-[#111827] absolute left-0">
              {habits[activeHabit]}
            </span>
          </div>
        </div>

        {/* CTAs — same style as home buttons */}
        <div className="reveal-4 flex flex-wrap justify-center gap-4 mb-5">
          <button
            onClick={() => navigate("/login")}
            className="shimmer-btn text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            Sign In to Continue
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-white border border-gray-200 text-[#111827] px-8 py-4 rounded-xl font-bold hover:border-gray-400 transition-all active:scale-95"
          >
            Create Account
          </button>
        </div>

        <p className="reveal-4 text-xs text-gray-400">Free to start. No credit card.</p>
      </div>
    </div>
  );
}