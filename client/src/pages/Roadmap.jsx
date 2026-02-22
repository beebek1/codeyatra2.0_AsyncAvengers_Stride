import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, Play } from 'lucide-react';

export default function RoadmapPage() {
  const navigate = useNavigate();

  // Initial progress state. 
  // Note: To update this from your sub-pages (/roadmap/beginner), 
  // you will eventually need to lift this state to a Context or use Redux/Zustand.
  const [progress, setProgress] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0
  });

  // Roadmap Configuration
  const levels = [
    { id: 'beginner', title: 'Beginner Phase', align: 'left', path: '/roadmap/beginner' },
    { id: 'intermediate', title: 'Intermediate Phase', align: 'right', path: '/roadmap/intermediate' },
    { id: 'advanced', title: 'Advanced Phase', align: 'left', path: '/roadmap/advanced' },
  ];

  // Logic to determine if a level is unlocked
  const checkUnlocked = (id) => {
    if (id === 'beginner') return true;
    if (id === 'intermediate') return progress.beginner === 100;
    if (id === 'advanced') return progress.intermediate === 100;
    return false;
  };

  const isFullyCompleted = progress.advanced === 100;

  return (
    // Strict Full-screen, no scroll layout
    <div className="h-screen w-screen overflow-hidden bg-[#ffffff] flex flex-col font-sans text-[#000000] selection:bg-[#f5c842] selection:text-black">
      
      {/* Header Section */}
      <header className="h-24 md:h-32 flex-shrink-0 flex flex-col items-center justify-end pb-4 md:pb-8 z-20">
        {isFullyCompleted ? (
          <div className="animate-in fade-in zoom-in flex items-center gap-2 px-6 py-3 bg-[#000000] text-[#f5c842] rounded-full font-black tracking-widest uppercase text-sm shadow-xl">
            <CheckCircle size={18} />
            <span>100% Roadmap Completed</span>
          </div>
        ) : (
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
            Career Roadmap
          </h1>
        )}
      </header>

      {/* Snake Roadmap Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center px-4 sm:px-8 pb-12 z-10">
        {levels.map((level, i) => {
          const isUnlocked = checkUnlocked(level.id);
          const currentProgress = progress[level.id];
          const isCompleted = currentProgress === 100;

          return (
            <div key={level.id} className="relative w-full flex flex-col">
              
              {/* SVG S-Curve connecting from the PREVIOUS level */}
              {i > 0 && (
                <SnakeCurve 
                  direction={level.align === 'right' ? 'left-to-right' : 'right-to-left'} 
                  isUnlocked={isUnlocked} 
                />
              )}

              {/* 2-Column Grid for precise geometric alignment */}
              <div className="grid grid-cols-2 w-full relative z-10">
                
                {level.align === 'left' ? (
                  <>
                    {/* Card on Left */}
                    <div className="col-span-1 flex flex-col items-center px-2 sm:px-6">
                      <NodeIcon isUnlocked={isUnlocked} isCompleted={isCompleted} />
                      <RoadmapCard 
                        level={level} 
                        isUnlocked={isUnlocked} 
                        currentProgress={currentProgress} 
                        isCompleted={isCompleted} 
                        onClick={() => isUnlocked && navigate(level.path)}
                      />
                    </div>
                    {/* Empty Right Column */}
                    <div className="col-span-1" />
                  </>
                ) : (
                  <>
                    {/* Empty Left Column */}
                    <div className="col-span-1" />
                    {/* Card on Right */}
                    <div className="col-span-1 flex flex-col items-center px-2 sm:px-6">
                      <NodeIcon isUnlocked={isUnlocked} isCompleted={isCompleted} />
                      <RoadmapCard 
                        level={level} 
                        isUnlocked={isUnlocked} 
                        currentProgress={currentProgress} 
                        isCompleted={isCompleted} 
                        onClick={() => isUnlocked && navigate(level.path)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

// 1. The Geometrically Perfect S-Curve SVG
const SnakeCurve = ({ direction, isUnlocked }) => {
  // SVG spans exactly 50% of the container (from col 1 center to col 2 center)
  const pathD = direction === 'left-to-right' 
    ? "M 0,0 C 0,50 100,50 100,100" 
    : "M 100,0 C 100,50 0,50 0,100";
    
  return (
    <div className="w-full h-10 md:h-16 flex -my-1 relative z-0 pointer-events-none">
      <svg 
        className="absolute w-1/2 h-full top-0 left-[25%]" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          d={pathD} 
          fill="none" 
          stroke={isUnlocked ? "#f5c842" : "#e5e7eb"} 
          strokeWidth="4" 
          strokeDasharray={isUnlocked ? "none" : "8 8"}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
    </div>
  );
};

// 2. The Status Node (Circle connecting the lines)
const NodeIcon = ({ isUnlocked, isCompleted }) => (
  <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center mb-3 z-10 bg-white transition-all duration-500 shadow-sm
    ${isCompleted ? 'border-[#000000] text-[#000000]' : isUnlocked ? 'border-[#f5c842] text-[#f5c842]' : 'border-gray-200 text-gray-300'}
  `}>
    {isCompleted ? (
      <CheckCircle size={16} strokeWidth={4} />
    ) : (
      <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${isUnlocked ? 'bg-[#f5c842]' : 'bg-gray-200'}`} />
    )}
  </div>
);

// 3. The Minimalist Data Card
function RoadmapCard({ level, isUnlocked, currentProgress, isCompleted, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full max-w-sm rounded-2xl p-5 md:p-6 border transition-all duration-300 relative group
        ${isUnlocked 
          ? 'bg-[#ffffff] border-gray-200 cursor-pointer hover:border-[#000000] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1' 
          : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
        }`}
    >
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-lg md:text-xl font-black text-[#000000] tracking-tight uppercase">{level.title}</h3>
        
        {/* Status Badge */}
        <div className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border
          ${!isUnlocked 
            ? 'bg-gray-100 border-gray-200 text-gray-500' 
            : isCompleted 
              ? 'bg-black border-black text-[#f5c842]' 
              : 'bg-white border-[#f5c842] text-black'
          }`}
        >
          {!isUnlocked && <Lock size={10} strokeWidth={3} />}
          {isCompleted && <CheckCircle size={10} strokeWidth={3} />}
          {!isUnlocked ? 'Locked' : isCompleted ? 'Done' : 'Active'}
        </div>
      </div>

      {/* Progress Bar Rendering */}
      <div className="mt-2">
        <div className="flex justify-between text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">
          <span>Progress</span>
          <span className={isUnlocked ? 'text-black' : ''}>{currentProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f5c842] rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${currentProgress}%` }}
          >
            {/* Shimmer effect on active bar */}
            {isUnlocked && !isCompleted && (
               <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Hover visual cue for unlocked cards */}
      {isUnlocked && (
        <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
           <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[#f5c842]">
             {isCompleted ? <CheckCircle size={16} /> : <Play size={14} className="ml-0.5" />}
           </div>
        </div>
      )}
    </div>
  );
}