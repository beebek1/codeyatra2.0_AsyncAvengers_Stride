import{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

//url not matched
const NotFound = () => {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 overflow-hidden relative font-mono">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-black" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-black" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-black" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-black" />

      <div className="max-w-xl w-full text-center relative z-10">

        {/* Stage label */}
        <div className="inline-flex items-center gap-2 border border-black/10 bg-black/[0.03] px-4 py-1.5 rounded-full mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
          </span>
          <span className="text-[9px] font-black tracking-[0.35em] uppercase text-black/50">
            Route Not Found
          </span>
        </div>

        {/* 404 block */}
        <div className="relative mb-6 select-none">
          {/* Ghost number */}
          <div className="text-[160px] md:text-[220px] font-black leading-none tracking-tighter text-black/[0.04]">
            404
          </div>

          {/* Overlay real text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              <h1
                className={`text-6xl md:text-8xl font-black tracking-tighter text-black uppercase transition-all duration-75 ${
                  glitch ? "translate-x-[3px] opacity-80" : ""
                }`}
              >
                Dead End
              </h1>
              {/* glitch layer */}
              {glitch && (
                <h1 className="absolute inset-0 text-6xl md:text-8xl font-black tracking-tighter text-black/30 uppercase translate-x-[-4px] translate-y-[2px]">
                  Dead End
                </h1>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-black/30">
            Stage 0 of 4
          </span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <p className="text-black/40 text-[11px] font-bold tracking-widest uppercase max-w-xs mx-auto leading-relaxed mb-12">
          This page was never part of the roadmap. It does not exist in any stage.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full md:w-auto px-8 py-4 border border-black/15 bg-black/[0.03] text-black rounded-lg text-[10px] font-black tracking-[0.25em] uppercase hover:bg-black/[0.07] transition-colors cursor-pointer"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full md:w-auto px-10 py-4 bg-black text-white rounded-lg text-[10px] font-black tracking-[0.25em] uppercase hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>

        {/* Progress bar decoration */}
        <div className="mt-16 max-w-xs mx-auto">
          <div className="flex justify-between mb-2">
            <span className="text-[9px] font-black tracking-widest uppercase text-black/30">
              Your Progress
            </span>
            <span className="text-[9px] font-black tracking-widest uppercase text-black/30">
              0%
            </span>
          </div>
          <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-black rounded-full" />
          </div>
          <p className="text-[9px] font-black tracking-widest uppercase text-black/20 mt-2">
            No stage selected
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 text-[9px] font-black tracking-[0.5em] text-black/15 uppercase select-none">
        Stride — Async Avengers
      </div>
    </div>
  );
};



//scroll to top while chaging the url
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};



//button element 
const LoaderButton = ({
  onClick,
  isLoading,
  text,
  loadingText = "Processing...",
  type = "submit",
  className = ""
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full font-semibold py-4 px-6 rounded-lg transition-colors duration-200 uppercase tracking-wide
        ${isLoading
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-black hover:bg-gray-800 cursor-pointer text-white"}
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isLoading ? loadingText : text}
      </div>
    </button>
  );
};


export {NotFound, ScrollToTop, LoaderButton};