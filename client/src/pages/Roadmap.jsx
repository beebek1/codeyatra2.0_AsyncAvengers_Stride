import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, Play } from 'lucide-react';
import Kanban from '../components/Kanban';
import { useLocation } from 'react-router-dom';
import { getLevelsByCareerId } from '../services/api';
import toast from 'react-hot-toast';

const PANEL_WIDTH = 420;

export default function RoadmapPage() {
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
        setCareerLevels(levels);

        // Build progress map from backend data
        // Expects each level to have: { id, completion (0-100) }
        const initialProgress = {};
        levels.forEach((level) => {
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

  const panelOpen = activePanel !== null;
  const openPanel = (levelId) => setActivePanel(levelId);
  const closePanel = () => setActivePanel(null);

  const handleLevelComplete = (levelId) => {
    setProgress((prev) => ({ ...prev, [levelId]: 100 }));
    setActivePanel(null);
  };

  // Align alternates: left, right, left, right...
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
            const isActive = activePanel === level.id;

            return (
              <div key={level.id} className="relative w-full flex flex-col">
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
                          onClick={() => isUnlocked && openPanel(level.id)}
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
                          onClick={() => isUnlocked && openPanel(level.id)}
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

      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.div
            key="kanban-panel"
            initial={{ width: 0 }}
            animate={{ width: PANEL_WIDTH }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="flex-shrink-0 h-screen sticky top-0 overflow-hidden border-l border-gray-100 shadow-2xl bg-white z-30"
            style={{ minWidth: 0 }}
          >
            <div style={{ width: PANEL_WIDTH }} className="h-full">
              <Kanban
                levelId={activePanel}
                onClose={closePanel}
                onLevelComplete={handleLevelComplete}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

function RoadmapCard({ level, isUnlocked, currentProgress, isCompleted, isFirst, isActive, onClick }) {
  return (
    <div className={`w-full max-w-sm relative ${isFirst ? 'pt-0' : 'pt-8'}`}>
      {!isFirst && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
          <div
            className={`w-14 h-14 rounded-full border-[5px] flex items-center justify-center bg-white transition-all duration-500
              ${isCompleted
                ? 'border-black shadow-lg'
                : isUnlocked
                  ? 'border-[#f5c842] shadow-[0_0_25px_rgba(245,200,66,0.4)]'
                  : 'border-gray-300 shadow-sm'
              }`}
          >
            {isCompleted ? (
              <CheckCircle size={22} strokeWidth={3} className="text-black" />
            ) : isUnlocked ? (
              <div className="w-4 h-4 rounded-full bg-[#f5c842] animate-pulse" />
            ) : (
              <Lock size={18} strokeWidth={2.5} className="text-gray-400" />
            )}
          </div>
        </div>
      )}

      <div
        onClick={onClick}
        className={`w-full rounded-[2.5rem] p-8 transition-all duration-500 relative group z-10
          ${!isFirst ? 'pt-12' : ''}
          ${isActive
            ? 'bg-white border-2 border-black shadow-2xl scale-[1.02] cursor-pointer'
            : isCompleted
              ? 'bg-white border-2 border-black cursor-pointer shadow-sm hover:-translate-y-2 hover:shadow-2xl'
              : isUnlocked
                ? 'bg-white border-2 border-[#f5c842] cursor-pointer shadow-sm hover:-translate-y-2 hover:shadow-2xl'
                : 'bg-gray-50 border-2 border-gray-300 cursor-not-allowed opacity-70'
          }`}
      >
        <div className="flex items-start justify-between mb-8">
          <h3
            className={`text-2xl font-black tracking-tighter uppercase leading-none ${
              !isUnlocked ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            {level.level_name}
          </h3>
          <div
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full
              ${!isUnlocked
                ? 'bg-gray-200 text-gray-400'
                : isCompleted
                  ? 'bg-black text-[#f5c842]'
                  : 'bg-[#f5c842] text-black'
              }`}
          >
            {isCompleted ? 'Done' : isUnlocked ? 'Open' : 'Locked'}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-3">
            <span className="text-gray-400">Completion</span>
            <span className={!isUnlocked ? 'text-gray-400' : 'text-black'}>
              {currentProgress}%
            </span>
          </div>
          <div
            className={`w-full h-3 rounded-full overflow-hidden ${
              !isUnlocked ? 'bg-gray-200' : 'bg-gray-100'
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                !isUnlocked ? 'bg-gray-300' : 'bg-[#f5c842]'
              }`}
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        {isUnlocked && !isActive && (
          <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#f5c842] shadow-xl">
              <Play size={18} fill="currentColor" className="ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}