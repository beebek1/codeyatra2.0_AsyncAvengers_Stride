import{ useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

//for not provided url
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="nd-root min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .nd-root { font-family: 'DM Sans', sans-serif; }
        
        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(245, 200, 66, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
          z-index: 0;
        }

        .float-slow { animation: float 6s ease-in-out infinite; }
        .float-delay { animation: float 8s ease-in-out infinite 1s; }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 30px); }
        }
      `}</style>

      {/* Background Decorative Elements */}
      <div className="blob float-slow -top-20 -left-20" />
      <div className="blob float-delay -bottom-20 -right-20" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        
        {/* Large Creative Header */}
        <div className="relative mb-4">
          <span className="text-[180px] md:text-[240px] font-extrabold text-[#0E0E0E]/5 select-none leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center mt-12">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-[#F5C842] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#F5C842]/40 rotate-12 hover:rotate-0 transition-transform duration-500">
              <svg width="40%" height="40%" viewBox="0 0 18 18" fill="none">
                 <path d="M9 2L3 5.5V9L9 12.5L15 9V5.5L9 2Z" fill="#0E0E0E" fillOpacity="0.85"/>
                 <path d="M3 11L9 14.5L15 11V13L9 16.5L3 13V11Z" fill="#0E0E0E" fillOpacity="0.45"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 -mt-4 md:-mt-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0E0E0E] tracking-tight">
            Roadmap Terminated.
          </h1>
          <p className="text-[#777] text-lg max-w-md mx-auto leading-relaxed">
            The path you’re looking for hasn’t been forged yet. Perhaps it’s time to start a new career journey?
          </p>
        </div>

        {/* Creative "Stage" Indicator */}
        <div className="mt-12 mb-12 flex flex-col items-center">
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1 w-12 rounded-full ${i === 4 ? 'bg-red-400/50' : 'bg-[#0E0E0E]/10'}`} />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400">
            Error: Stage 404 Overflow
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-[#0E0E0E] bg-white border border-[#E0E0E0] hover:border-[#0E0E0E] transition-all duration-300 cursor-pointer shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 bg-[#0E0E0E] text-white rounded-full text-[15px] font-bold hover:bg-[#2a2a2a] shadow-xl shadow-black/10 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Stride out
          </button>
        </div>
      </div>

      {/* Corner Details */}
      <div className="hidden lg:block absolute top-12 left-12 text-[12px] font-medium text-[#0E0E0E]/20 rotate-90 origin-left">
        LATENCY: NULL // ROUTE: UNKNOWN
      </div>
      <div className="hidden lg:block absolute bottom-12 right-12 text-[12px] font-medium text-[#0E0E0E]/20">
        © 2026 CAREERFORGE STUDIO
      </div>
    </div>
  );
};

//for loading while fetching data
const stages = [
  "Syncing your profile",
  "Mapping career paths",
  "Calculating Fit Scores",
  "Building your roadmap",
];

const LoadingScreen = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [fadeStage, setFadeStage] = useState(true);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setFadeStage(false);
      setTimeout(() => {
        setStageIndex((i) => (i + 1) % stages.length);
        setFadeStage(true);
      }, 250);
    }, 2400);

    return () => {
      clearInterval(stageTimer);
    };
  }, []);

  return (
    <div className="loader-root fixed inset-0 bg-[#ffffff] z-[9999] flex flex-col items-center justify-center p-8 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .loader-root, .loader-root * { font-family: 'DM Sans', sans-serif; }

        /* Dynamic Mesh Background */
        .mesh-bg {
          position: absolute;
          inset: 0;
          background-color: #ffffff;
          background-image: 
            radial-gradient(at 0% 0%, rgba(245, 200, 66, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(100, 116, 255, 0.08) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(245, 200, 66, 0.1) 0px, transparent 50%);
          filter: blur(80px);
          z-index: 0;
        }

        .logo-container { animation: logoFloat 4s ease-in-out infinite; }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .stage-in  { opacity: 1; transform: translateY(0); transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1); }
        .stage-out { opacity: 0; transform: translateY(8px); transition: all 0.3s ease-in; }

        /* Animated Floating Shapes */
        .shape {
          position: absolute;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          background: #F5C842;
          opacity: 0.06;
          z-index: 0;
          animation: morph 10s linear infinite;
        }

        @keyframes morph {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          33% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
          66% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        .dot-pulse {
          animation: dotPulse 1.5s infinite ease-in-out;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Decorative Elements */}
      <div className="mesh-bg" />
      <div className="shape w-96 h-96 -top-20 -right-20" />
      <div className="shape w-80 h-80 -bottom-10 -left-10" style={{ animationDelay: '-5s', background: '#6474FF' }} />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        
        {/* Favicon Logo instead of Icon Box */}
        <div className="relative mb-10 logo-container">
          <div className="absolute inset-[-20px] bg-[#F5C842]/10 blur-2xl rounded-full animate-pulse" />
          <img 
            src="/favicon.png" 
            alt="Logo" 
            className="w-24 h-24 md:w-28 md:h-28 object-contain relative z-10"
          />
        </div>

        {/* Brand Text */}
        <div className="text-center mb-8">
          <h1 className="text-[46px] font-[900] tracking-tighter text-[#0E0E0E] leading-tight">
            Stride
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[2px] w-5 bg-[#F5C842]" />
            <p className="text-[11px] font-black text-[#777] uppercase tracking-[0.4em]">
              Intelligence
            </p>
            <div className="h-[2px] w-5 bg-[#F5C842]" />
          </div>
        </div>

        {/* Dynamic Status Text (Replacing Progress Bar as focal point) */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 flex items-center justify-center">
            <span
              className={`text-[16px] font-bold text-[#0E0E0E] tracking-tight ${
                fadeStage ? "stage-in" : "stage-out"
              }`}
            >
              {stages[stageIndex]}
            </span>
          </div>

          {/* Animated Loading Indicator */}
          <div className="flex gap-2 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F5C842] dot-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#F5C842] dot-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#F5C842] dot-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* Footer Branded Element */}
      <div className="absolute bottom-12 flex items-center gap-4 text-[#0E0E0E]/20">
        <span className="text-[10px] font-black tracking-widest uppercase">System Operational</span>
        <div className="w-1 h-1 rounded-full bg-current" />
        <span className="text-[10px] font-black tracking-widest uppercase">Stride v2.0</span>
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


export {NotFound, ScrollToTop, LoaderButton, LoadingScreen};