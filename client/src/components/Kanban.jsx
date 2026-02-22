import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  const yellowColor = '#f5c842';

  useEffect(() => {
    const mockData = [
      { id: '1', content: 'Design new landing page', week: 'WEEK 1', checked: false },
      { id: '2', content: 'Fix navigation bug', week: 'WEEK 2-4', checked: false },
      { id: '3', content: 'Review pull requests', week: 'MONTH 2', checked: false },
      { id: '4', content: 'Implement user authentication', week: 'MONTH 3', checked: false },
    ];
    setTasks(mockData);
  }, []);

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const toggleCheck = (index) => {
    const task = tasks[index];

    if (task.checked) return;

    if (index > 0 && !tasks[index - 1].checked) {
      triggerToast('Please complete the previous step first!');
      return;
    }

    setTasks(prev =>
      prev.map((t, i) =>
        i === index ? { ...t, checked: true } : t
      )
    );
  };

  const completedTasks = tasks.filter(t => t.checked).length;
  const isAllComplete = tasks.length > 0 && completedTasks === tasks.length;
  const completionPercentage =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 z-50 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-sm"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.07)] overflow-hidden border border-gray-50">

          {/* Header */}
          <div className="px-14 py-12 border-b border-gray-50">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Roadmap
            </h1>
            <p className="text-xs font-bold text-gray-400 tracking-[0.4em] uppercase mt-4">
              Sequential Task Management
            </p>
          </div>

          <div className="p-12">

            {/* Phase Label */}
            <div className="mb-8">
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-2">
                Phase
              </p>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Beginner
              </h2>
            </div>

            {/* Tasks */}
            <div className="space-y-5 mb-12">
              {tasks.map((task, index) => {
                const isLocked = index > 0 && !tasks[index - 1].checked;

                return (
                  <motion.div
                    key={task.id}
                    whileTap={
                      !task.checked && isLocked
                        ? { x: [-4, 4, -4, 4, 0] }
                        : { scale: 0.98 }
                    }
                    onClick={() => toggleCheck(index)}
                  >
                    <div
                      className={`rounded-[2.5rem] p-7 transition-all duration-300 border-2 ${
                        task.checked
                          ? 'bg-gray-50/50 border-gray-100 cursor-default'
                          : isLocked
                          ? 'bg-white border-gray-50 opacity-40 cursor-not-allowed'
                          : 'bg-white border-gray-100 hover:border-gray-200 cursor-pointer shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: task.checked
                              ? yellowColor
                              : 'transparent',
                            borderColor: task.checked
                              ? yellowColor
                              : isLocked
                              ? '#f3f4f6'
                              : '#e5e7eb'
                          }}
                        >
                          {task.checked && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={4}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </motion.svg>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                            {task.week}
                          </div>
                          <div className="text-xl font-bold text-gray-900 tracking-tight">
                            {task.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress */}
            <div className="bg-gray-50/50 p-12 rounded-[3rem] border-2 border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Completion Rate
                </p>
                <div
                  className="text-7xl font-black tracking-tighter"
                  style={{ color: yellowColor }}
                >
                  {completionPercentage}%
                </div>
              </div>

              <AnimatePresence>
                {isAllComplete && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#000",
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      triggerToast('Moving to the next phase...')
                    }
                    className="bg-black text-white px-14 py-6 rounded-[1.5rem] font-black shadow-2xl flex items-center gap-3 transition-all"
                  >
                    NEXT STEP
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}