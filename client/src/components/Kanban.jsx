import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ChevronRight, Lock } from 'lucide-react';

const Y = '#f5c842';
const INK = '#1A1A1A';

// Your updated mock data structure
export const MOCK_BACKEND_TASKS = {
  "frontend": [
    { id: 'fe-1', task_name: 'Mastering Semantic HTML & CSS Variables', status: 'pen', timeline: '3 days' },
    { id: 'fe-2', task_name: 'Deep Dive into Modern JavaScript (ES6+)', status: 'pending', timeline: '1 week' },
    { id: 'fe-3', task_name: 'Building Reactive UIs with React.js', status: 'pending', timeline: '10 days' },
    { id: 'fe-4', task_name: 'State Management with Redux & Context API', status: 'pending', timeline: '5 days' },
    { id: 'fe-5', task_name: 'Testing Components with Vitest & RTL', status: 'pending', timeline: '4 days' }
  ],
  "backend": [
    { id: 'be-1', task_name: 'Server-side Logic with Node.js', status: 'pending', timeline: '5 days' },
    { id: 'be-2', task_name: 'Database Modeling with PostgreSQL', status: 'pending', timeline: '1 week' },
    { id: 'be-3', task_name: 'Authentication & JWT Security', status: 'pending', timeline: '4 days' },
    { id: 'be-4', task_name: 'Deploying Scalable APIs to AWS', status: 'pending', timeline: '6 days' }
  ],
  "aieng": [
    { id: 'ai-1', task_name: 'Python for Data Engineering', status: 'completed', timeline: '4 days' },
    { id: 'ai-2', task_name: 'Understanding Neural Networks', status: 'pending', timeline: '2 weeks' },
    { id: 'ai-3', task_name: 'Implementing LLMs with LangChain', status: 'pending', timeline: '8 days' },
    { id: 'ai-4', task_name: 'Fine-tuning Models for Production', status: 'pending', timeline: '12 days' }
  ],
  "uidesign": [
    { id: 'ui-1', task_name: 'Visual Hierarchy & Typography', status: 'pending', timeline: '3 days' },
    { id: 'ui-2', task_name: 'Mastering Auto-Layout in Figma', status: 'pending', timeline: '2 days' },
    { id: 'ui-3', task_name: 'Building Accessible Design Systems', status: 'pending', timeline: '1 week' },
    { id: 'ui-4', task_name: 'High-Fidelity Prototyping', status: 'pending', timeline: '5 days' }
  ],
  "pm": [
    { id: 'pm-1', task_name: 'Market Research & User Interviews', status: 'pending', timeline: '1 week' },
    { id: 'pm-2', task_name: 'Defining PRDs and User Stories', status: 'pending', timeline: '4 days' },
    { id: 'pm-3', task_name: 'Prioritization Frameworks (RICE)', status: 'pending', timeline: '3 days' },
    { id: 'pm-4', task_name: 'A/B Testing & Data Analytics', status: 'pending', timeline: '6 days' }
  ],
  "fintech": [
    { id: 'fin-1', task_name: 'Introduction to Financial Markets', status: 'pending', timeline: '5 days' },
    { id: 'fin-2', task_name: 'API Integrations for Payments (Stripe)', status: 'pending', timeline: '1 week' },
    { id: 'fin-3', task_name: 'Regulatory Compliance & KYC', status: 'pending', timeline: '4 days' }
  ]
};

export default function Kanban({ levelId = 'frontend', onClose, onLevelComplete }) {
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Sync tasks when levelId changes
  useEffect(() => {
    const data = MOCK_BACKEND_TASKS[levelId] || MOCK_BACKEND_TASKS["frontend"];
    setTasks(data.map(t => ({ ...t, checked: t.status === 'completed' })));
  }, [levelId]);

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const toggleCheck = (index) => {
    const task = tasks[index];
    if (task.checked) return;
    
    // Logic check: Prevents skipping tasks
    if (index > 0 && !tasks[index - 1].checked) {
      triggerToast('Complete previous steps to unlock');
      return;
    }

    const updated = tasks.map((t, i) => 
      i === index ? { ...t, checked: true, status: 'completed' } : t
    );
    setTasks(updated);

    if (updated.every(t => t.checked) && onLevelComplete) {
      setTimeout(() => onLevelComplete(levelId), 1000);
    }
  };

  const completedCount = tasks.filter(t => t.checked).length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const isAllComplete = completedCount === tasks.length;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative selection:bg-[#f5c842]/30">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute top-6 left-1/2 z-[100] bg-[#1A1A1A] text-white px-6 py-3.5 rounded-2xl font-bold text-[11px] shadow-2xl border border-white/5 flex items-center gap-3"
          >
            <Lock size={14} className="text-[#f5c842]" strokeWidth={3} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clean Header */}
      <div className="flex items-center justify-between px-10 pt-10 pb-8 border-b border-black/[0.03]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f5c842] shadow-[0_0_8px_#f5c842]" />
            <p className="text-[10px] font-black text-[#BBB] uppercase tracking-[0.3em]">Learning Roadmap</p>
          </div>
          <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-none">
            {levelId}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-[#F9F9F8] flex items-center justify-center hover:bg-[#1A1A1A] group transition-all duration-500 cursor-pointer"
        >
          <X size={20} className="text-[#1A1A1A] group-hover:text-white transition-colors" strokeWidth={2.5} />
        </button>
      </div>

      {/* Scrollable Task List */}
      <div className="flex-1 overflow-y-auto px-10 py-8 space-y-5">
        {tasks.map((task, index) => {
          const isLocked = index > 0 && !tasks[index - 1].checked;
          
          return (
            <motion.div
              key={task.id}
              whileTap={isLocked ? { x: [-4, 4, -4, 4, 0] } : { scale: 0.98 }}
              onClick={() => toggleCheck(index)}
              className="relative"
            >
              <div
                className={`rounded-[2rem] p-6 transition-all duration-500 border-2 ${
                  task.checked
                    ? 'bg-[#FBFBF9] border-transparent opacity-60'
                    : isLocked
                    ? 'bg-white border-gray-50 opacity-40 cursor-not-allowed shadow-none'
                    : 'bg-white border-black/[0.04] hover:border-[#f5c842]/40 cursor-pointer shadow-sm hover:shadow-xl'
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Status Circle */}
                  <div
                    className="w-10 h-10 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-500"
                    style={{
                      backgroundColor: task.checked ? Y : 'transparent',
                      borderColor: task.checked ? Y : isLocked ? '#F0F0EE' : '#E5E7EB',
                    }}
                  >
                    {task.checked ? (
                      <motion.svg
                        initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
                        className="w-5 h-5 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    ) : isLocked ? (
                      <Lock size={14} className="text-gray-200" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-[#f5c842] transition-colors" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={11} className={task.checked ? "text-gray-300" : "text-[#f5c842]"} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${task.checked ? 'text-gray-300' : 'text-[#BBB]'}`}>
                        {task.timeline}
                      </span>
                    </div>
                    <div className={`text-[16px] font-bold tracking-tight leading-tight ${task.checked ? 'text-gray-400 line-through font-medium' : 'text-[#1A1A1A]'}`}>
                      {task.task_name}
                    </div>
                  </div>

                  {!task.checked && !isLocked && (
                    <div className="w-8 h-8 rounded-full bg-[#f5c842]/10 flex items-center justify-center">
                      <ChevronRight size={16} className="text-[#f5c842]" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Footer Progress */}
      <div className="flex-shrink-0 px-10 py-10 border-t border-black/[0.03] bg-white flex items-center justify-between gap-10">
        <div className="flex flex-col">
          <p className="text-[11px] font-black text-[#BBB] uppercase tracking-widest mb-1">Phase Status</p>
          <div className="text-5xl font-black tracking-tighter text-[#1A1A1A]">
            {pct}<span className="text-[#f5c842]">%</span>
          </div>
        </div>

        <div className="flex-1 relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: Y }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>

        <AnimatePresence>
          {isAllComplete && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLevelComplete && onLevelComplete(levelId)}
              className="bg-[#1A1A1A] text-white px-8 py-5 rounded-[2rem] font-black text-xs shadow-2xl flex items-center gap-3 cursor-pointer"
            >
              UPGRADE PHASE
              <div className="w-6 h-6 rounded-full bg-[#f5c842] flex items-center justify-center">
                <ChevronRight size={14} className="text-[#1A1A1A]" strokeWidth={4} />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}