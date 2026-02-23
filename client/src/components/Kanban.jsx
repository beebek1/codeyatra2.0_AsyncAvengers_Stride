import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const LEVEL_TASKS = {
  beginner: [
    { id: 'b1', content: 'Design new landing page', week: 'WEEK 1' },
    { id: 'b2', content: 'Fix navigation bug', week: 'WEEK 2-4' },
    { id: 'b3', content: 'Review pull requests', week: 'MONTH 2' },
    { id: 'b4', content: 'Implement user authentication', week: 'MONTH 3' },
  ],
  intermediate: [
    { id: 'i1', content: 'Build REST API endpoints', week: 'WEEK 1' },
    { id: 'i2', content: 'Write unit tests', week: 'WEEK 2-4' },
    { id: 'i3', content: 'Set up CI/CD pipeline', week: 'MONTH 2' },
    { id: 'i4', content: 'Performance audit', week: 'MONTH 3' },
  ],
  advanced: [
    { id: 'a1', content: 'System architecture design', week: 'WEEK 1' },
    { id: 'a2', content: 'Microservices migration', week: 'WEEK 2-4' },
    { id: 'a3', content: 'Security hardening', week: 'MONTH 2' },
    { id: 'a4', content: 'Scale to 1M users', week: 'MONTH 3' },
  ],
};

const Y = '#f5c842';

export default function Kanban({ levelId, onClose, onLevelComplete }) {
  const initialTasks = (LEVEL_TASKS[levelId] || LEVEL_TASKS.beginner).map(t => ({
    ...t,
    checked: false,
  }));

  const [tasks, setTasks] = useState(initialTasks);
  const [toast, setToast] = useState({ show: false, message: '' });

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const toggleCheck = (index) => {
    const task = tasks[index];
    if (task.checked) return;
    if (index > 0 && !tasks[index - 1].checked) {
      triggerToast('Complete the previous step first.');
      return;
    }
    const updated = tasks.map((t, i) => i === index ? { ...t, checked: true } : t);
    setTasks(updated);

    const allDone = updated.every(t => t.checked);
    if (allDone && onLevelComplete) {
      setTimeout(() => onLevelComplete(levelId), 600);
    }
  };

  const completedCount = tasks.filter(t => t.checked).length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const isAllComplete = completedCount === tasks.length;

  const levelLabel = levelId
    ? levelId.charAt(0).toUpperCase() + levelId.slice(1)
    : 'Beginner';

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-2xl whitespace-nowrap"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-gray-100 flex-shrink-0">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Phase</p>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            {levelLabel}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X size={16} strokeWidth={2.5} className="text-gray-600" />
        </button>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {tasks.map((task, index) => {
          const isLocked = index > 0 && !tasks[index - 1].checked;
          return (
            <motion.div
              key={task.id}
              whileTap={isLocked ? { x: [-4, 4, -4, 4, 0] } : { scale: 0.98 }}
              onClick={() => toggleCheck(index)}
            >
              <div
                className={`rounded-[1.5rem] p-5 transition-all duration-300 border-2 ${
                  task.checked
                    ? 'bg-gray-50 border-gray-100 cursor-default'
                    : isLocked
                    ? 'bg-white border-gray-100 opacity-40 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:border-gray-300 cursor-pointer shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: task.checked ? Y : 'transparent',
                      borderColor: task.checked ? Y : isLocked ? '#f3f4f6' : '#e5e7eb',
                    }}
                  >
                    {task.checked && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">
                      {task.week}
                    </div>
                    <div className={`text-base font-bold tracking-tight truncate ${task.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.content}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-8 py-6 border-t border-gray-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Progress</p>
          <div className="text-4xl font-black tracking-tighter" style={{ color: Y }}>
            {pct}%
          </div>
        </div>

        <div className="flex-1 max-w-[120px]">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: Y }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        <AnimatePresence>
          {isAllComplete && (
            <motion.button
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLevelComplete && onLevelComplete(levelId)}
              className="bg-black text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2"
            >
              NEXT
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}