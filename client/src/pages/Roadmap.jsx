import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, Play, Star, Zap, TrendingUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLevelsByCareerId } from '../services/api';
import toast from 'react-hot-toast';

const PANEL_WIDTH = 420;

export default function RoadmapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { careerId, careerLabel } = location.state || {};

  const [careerLevels, setCareerLevels] = useState([]);
  const [progress, setProgress] = useState({});
  const [activePanel, setActivePanel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!careerId) {
      console.log('careerId not provided');
      setLoading(false);
      return;
    }

    const fetchLevels = async () => {
      try {
        const res = await getLevelsByCareerId(careerId);
        const levels = res?.data?.levels || [];

        // ✅ FIX: Sort levels by a consistent field so order never changes between renders.
        // Uses whichever field your backend provides — add/adjust field names as needed.
        const sorted = [...levels].sort((a, b) => {
          const aVal = a.order ?? a.sequence ?? a.level_order ?? a.createdAt ?? a.id ?? 0;
          const bVal = b.order ?? b.sequence ?? b.level_order ?? b.createdAt ?? b.id ?? 0;
          if (typeof aVal === 'string') return aVal.localeCompare(bVal);
          return aVal - bVal;
        });

        setCareerLevels(sorted);

        const initialProgress = {};
        sorted.forEach((level) => {
          initialProgress[level.id] = level.completion ?? 0;
        });
        setProgress(initialProgress);
      } catch (err) {
        console.log('Failed to fetch career levels', err);
        toast.error('Failed to load roadmap levels.');
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [careerId]);

  const isFullyCompleted =
    careerLevels.length > 0 &&
    careerLevels.every((level) => (progress[level.id] ?? 0) === 100);

  const onClickHandler = (i, level_id) => {
    setActivePanel(i);
    navigate("/trello", { state: { level_id } });
  };

  const handleLevelComplete = (levelId) => {
    setProgress((prev) => ({ ...prev, [levelId]: 100 }));
    setActivePanel(null);
  };

  const getAlign = (index) => (index % 2 === 0 ? 'left' : 'right');

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center font-sans text-gray-900">
        <p className="text-sm font-bold tracking-widest uppercase text-gray-400 animate-pulse">
          Loading Roadmap...
        </p>
      </div>
    );
  }

  if (!careerLevels.length) {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center font-sans text-gray-900">
        <p className="text-sm font-bold tracking-widest uppercase text-gray-400">
          No levels found for this career.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex flex-row overflow-hidden font-sans text-gray-900 selection:bg-[#f5c842] selection:text-black">
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-500">
        <header className="h-32 md:h-48 flex-shrink-0 flex flex-col items-center justify-center z-20">
          {isFullyCompleted ? (
            <div className="animate-bounce flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-black rounded-full font-bold tracking-wider uppercase text-sm shadow-[0_8px_30px_rgb(245,200,66,0.2)]">
              <CheckCircle size={20} strokeWidth={2.5} className="text-[#f5c842]" />
              <span>Roadmap Completed</span>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-gray-900">
                {careerLabel || 'Your Path'}
              </h1>
              <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mt-2">
                Level by Level Mastery
              </p>
            </div>
          )}
        </header>

        <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col px-4 sm:px-8 pb-20 z-10">
          {careerLevels.map((level, i) => {
            const align = getAlign(i);
            const isUnlocked = level.status;
            const currentProgress = progress[level.id] ?? 0;
            const isCompleted = currentProgress === 100;
            const isActive = activePanel === i;

            return (
              <div key={`level-${level.id}`} className="relative w-full flex flex-col">
                {i > 0 && (
                  <SnakeCurve
                    direction={align === 'right' ? 'left-to-right' : 'right-to-left'}
                    isUnlocked={isUnlocked}
                  />
                )}

                <div className="grid grid-cols-2 w-full relative z-10">
                  {align === 'left' ? (
                    <>
                      <div className="col-span-1 flex flex-col items-center px-2 sm:px-6 relative">
                        <RoadmapCard
                          level={level}
                          isUnlocked={isUnlocked}
                          currentProgress={currentProgress}
                          isCompleted={isCompleted}
                          isFirst={i === 0}
                          isActive={isActive}
                          onStartClick={() => onClickHandler(i, level.level_id)}
                        />
                      </div>
                      <div className="col-span-1" />
                    </>
                  ) : (
                    <>
                      <div className="col-span-1" />
                      <div className="col-span-1 flex flex-col items-center px-2 sm:px-6 relative">
                        <RoadmapCard
                          level={level}
                          isUnlocked={isUnlocked}
                          currentProgress={currentProgress}
                          isCompleted={isCompleted}
                          isFirst={i === 0}
                          isActive={isActive}
                          onStartClick={() => onClickHandler(i, level.level_id)}
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
    </div>
  );
}

const SnakeCurve = ({ direction, isUnlocked }) => {
  const pathD =
    direction === 'left-to-right'
      ? 'M 0,0 C 0,75 100,25 100,100'
      : 'M 100,0 C 100,75 0,25 0,100';

  return (
    <div className="w-full h-24 md:h-32 flex -mt-7 -mb-7 relative z-0 pointer-events-none">
      <svg
        className="absolute w-1/2 h-full top-0 left-[25%]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          fill="none"
          stroke={isUnlocked ? '#000000' : '#d1d5db'}
          strokeWidth="20"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={pathD}
          fill="none"
          stroke={isUnlocked ? '#f5c842' : 'transparent'}
          strokeWidth="4"
          strokeDasharray="10 10"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-60"
        />
      </svg>
    </div>
  );
};

function RoadmapCard({ level, isUnlocked, isCompleted, isFirst, isActive, onStartClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const tags = level.tags || ["Core Theory", "Hands-on", "AI Review"];
  const marketDemand = level.demand || "High";

  return (
    <div className={`w-full max-w-sm relative ${isFirst ? 'pt-0' : 'pt-10'}`}>
      {!isFirst && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
          <div className={`w-14 h-14 rounded-full border-[5px] flex items-center justify-center bg-white transition-all duration-500
            ${isCompleted
              ? 'border-[#111827] shadow-lg'
              : isUnlocked
                ? 'border-[#F5C842] shadow-[0_0_20px_rgba(245,200,66,0.3)]'
                : 'border-gray-100 shadow-sm'
            }`}
          >
            {isCompleted ? (
              <CheckCircle size={22} strokeWidth={3} className="text-[#111827]" />
            ) : isUnlocked ? (
              <div className="w-3 h-3 rounded-full bg-[#F5C842] animate-pulse" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-gray-200" />
            )}
          </div>
        </div>
      )}

      <div
        onMouseEnter={() => isUnlocked && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full rounded-[2rem] p-7 transition-all duration-300 relative z-10 border-2
          ${isActive
            ? 'bg-white border-[#111827] shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] scale-[1.02]'
            : isCompleted
              ? `bg-white border-gray-200 ${isHovered ? 'shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] -translate-y-1' : 'shadow-sm'}`
              : isUnlocked
                ? `bg-white border-[#F5C842] ${isHovered ? 'shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] -translate-y-1' : 'shadow-sm'}`
                : 'bg-[#F9FAFB] border-dashed border-gray-200 opacity-60'
          }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isUnlocked ? 'text-[#F5C842]' : 'text-gray-400'}`}>
              Module {level.id || '01'}
            </span>
            <h3 className={`text-2xl font-extrabold tracking-tight leading-none mt-1 ${!isUnlocked ? 'text-gray-400' : 'text-[#111827]'}`}>
              {level.level_name}
            </h3>
          </div>

          {isUnlocked && (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase">
                <TrendingUp size={12} />
                {marketDemand}
              </div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Demand</div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all duration-300
                  ${!isUnlocked
                    ? 'border-gray-100 text-gray-300'
                    : isHovered || isActive
                      ? 'border-[#111827] text-[#111827] bg-gray-50'
                      : 'border-gray-100 bg-gray-50 text-gray-500'
                  }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className={`text-xs leading-relaxed ${isUnlocked ? 'text-gray-500' : 'text-gray-300'}`}>
            {isUnlocked
              ? "Master the industry standards required for top-tier roles."
              : "Complete previous modules to unlock this syllabus."}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
            ${isCompleted ? 'bg-[#111827] text-white' : isUnlocked ? 'bg-[#F5C842]/10 text-[#C8980A]' : 'bg-gray-100 text-gray-400'}`}>
            {isCompleted ? 'Module Cleared' : isUnlocked ? 'Ready to Forge' : 'Locked'}
          </div>

          {isUnlocked && (
            <button
              onClick={onStartClick}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border-2
                ${isActive
                  ? 'bg-[#111827] text-white border-[#111827]'
                  : 'bg-white text-[#111827] border-[#111827] hover:bg-[#111827] hover:text-white active:scale-95'
                }`}
            >
              <span>{isCompleted ? 'Review' : 'Start'}</span>
              <Play
                size={12}
                fill="currentColor"
                className={`transition-transform duration-300 ${isHovered ? 'translate-x-0.5' : ''}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}