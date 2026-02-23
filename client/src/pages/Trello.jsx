import React, { useState, useMemo, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleDashed, Clock, CheckCircle2, GripVertical, Sparkles } from "lucide-react";

// --- Trello Data & Constants ---
const rawTasks = [
  { id: "1", title: "Design Landing Page", status: "todo", tag: "Design" },
  { id: "2", title: "Setup Authentication", status: "todo", tag: "Backend" },
  { id: "3", title: "Build Dashboard UI", status: "doing", tag: "Frontend" },
  { id: "4", title: "Connect API", status: "doing", tag: "Integration" },
  { id: "5", title: "Deploy Project", status: "completed", tag: "DevOps" }
];

const COLUMNS = [
  { id: 'todo', title: 'To Do', icon: <CircleDashed size={20} className="text-[#ccc]" /> },
  { id: 'doing', title: 'In Progress', icon: <Clock size={20} className="text-[#F5C842]" /> },
  { id: 'completed', title: 'Completed', icon: <CheckCircle2 size={20} className="text-green-400" /> }
];

const COLUMN_ORDER = { 'todo': 0, 'doing': 1, 'completed': 2 };

export default function Trello() {
  const [mounted, setMounted] = useState(false);
  
  const [tasks, setTasks] = useState(() => {
    const initial = { todo: [], doing: [], completed: [] };
    rawTasks.forEach(task => {
      if (initial[task.status]) initial[task.status].push(task);
    });
    return initial;
  });
  
  const [activeTask, setActiveTask] = useState(null);
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [activeWidth, setActiveWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id) => {
    if (id in tasks) return id;
    return Object.keys(tasks).find((key) => tasks[key].find((task) => task.id === id));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const container = findContainer(active.id);
    if (container) {
      const task = tasks[container].find((t) => t.id === active.id);
      setActiveTask(task);
      
      const node = document.getElementById(`task-${active.id}`);
      if (node) {
        setActiveWidth(node.offsetWidth);
      }
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    if (COLUMN_ORDER[overContainer] < COLUMN_ORDER[activeContainer]) return; 

    setTasks((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((t) => t.id === activeId);
      const overIndex = overItems.findIndex((t) => t.id === overId);
      
      let newIndex = overId in prev ? overItems.length + 1 : (overIndex >= 0 ? overIndex : overItems.length + 1);

      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter((item) => item.id !== activeId),
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          { ...activeItems[activeIndex], status: overContainer },
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (activeContainer && overContainer && COLUMN_ORDER[overContainer] < COLUMN_ORDER[activeContainer]) {
      setActiveTask(null);
      return;
    }

    if (activeContainer !== 'completed' && overContainer === 'completed') {
      setJustCompletedId(activeId);
      setTimeout(() => setJustCompletedId(null), 1200); 
    }

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = tasks[activeContainer].findIndex((t) => t.id === activeId);
      const overIndex = tasks[overContainer].findIndex((t) => t.id === overId);

      if (activeIndex !== overIndex) {
        setTasks((prev) => ({
          ...prev,
          [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
        }));
      }
    }
    setActiveTask(null);
  };

  const dropAnimation = {
    duration: 350,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-6 md:px-10 py-16 flex flex-col items-center font-sans">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pop-card {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
          40% { transform: scale(1.05) translateY(-4px) rotate(1deg); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
          100% { transform: scale(1) translateY(0) rotate(0); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        }
        .animate-pop { animation: pop-card 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 1; }
          100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
        }
        .particle { animation: float-up 0.8s ease-out forwards; }
      `}} />

      <div className={`text-center mb-12 transition-all duration-700 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-[#bbb] mb-2">Project Workflow</p>
        <h1
          className="font-black text-[#0E0E0E] tracking-tight"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
        >
          Sprint Board
        </h1>
        <p className="text-[17px] text-[#999] mt-3">Drag and drop tasks to update your progress.</p>
      </div>

      <div className={`w-full flex justify-center transition-all duration-1000 delay-100 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`} style={{ maxWidth: "1400px" }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                icon={col.icon}
                items={tasks[col.id]}
                justCompletedId={justCompletedId}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask ? (
              // 🔥 Added pointer-events-none to guarantee the overlay never blocks the mouse sensor
              <div style={{ width: activeWidth }} className="pointer-events-none">
                <TaskCard task={activeTask} isOverlay />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function Column({ id, title, icon, items, justCompletedId }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  return (
    <div
      className={`flex flex-col bg-white rounded-3xl border transition-all duration-300 shadow-sm ${
        isOver ? 'border-[#F5C842] ring-4 ring-[#FEFBF0] scale-[1.01]' : 'border-[#EBEBEB]'
      }`}
    >
      <div className="p-6 md:p-8 pb-6 flex justify-between items-center border-b border-[#F5F5F5]">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-[14px] font-black tracking-widest uppercase text-[#0E0E0E]">
            {title}
          </h2>
        </div>
        <div className="bg-[#F5F5F5] px-3 py-1 rounded-full border border-[#EBEBEB]">
          <span className="text-[12px] font-bold text-[#999]">{items.length}</span>
        </div>
      </div>

      <div ref={setNodeRef} className="p-6 flex flex-col gap-4 min-h-[500px] bg-[#FCFCFC] rounded-b-3xl">
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.map((task) => (
            <SortableTask key={task.id} task={task} isJustCompleted={justCompletedId === task.id} />
          ))}
        </SortableContext>
        
        {items.length === 0 && (
          <div className="w-full h-28 border-2 border-dashed border-[#EBEBEB] rounded-2xl flex items-center justify-center bg-white">
            <p className="text-[12px] font-bold tracking-widest uppercase text-[#ccc]">Drop Here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTask({ task, isJustCompleted }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        id={`task-${task.id}`}
        style={style} 
        className="opacity-40 border-2 border-dashed border-[#ccc] bg-[#FAFAFA] rounded-2xl overflow-hidden"
      >
        <div className="invisible">
          <TaskCard task={task} isJustCompleted={false} />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      id={`task-${task.id}`}
      style={style} 
      {...attributes} 
      {...listeners}
      // 🔥 Added touch-none and select-none to completely lock out browser interference
      className="touch-none select-none" 
    >
      <TaskCard task={task} isJustCompleted={isJustCompleted} />
    </div>
  );
}

function TaskCard({ task, isOverlay, isJustCompleted }) {
  const isTodo = task.status === 'todo';
  const isDoing = task.status === 'doing';
  const isCompleted = task.status === 'completed';

  const cardTheme = isTodo 
    ? 'bg-white border-[#EBEBEB]' 
    : isDoing
    ? 'bg-white border-[#EBEBEB] border-l-4 border-l-[#F5C842]'
    : 'bg-green-50 border-green-100';

  const hoverEffect = isOverlay ? '' : 'hover:-translate-y-1 hover:shadow-md transition-all duration-200 shadow-sm';
  const overlayEffect = isOverlay ? 'scale-[1.02] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-[#F5C842] ring-2 ring-[#F5C842]/20 z-50 bg-white cursor-grabbing' : 'cursor-grab';

  return (
    <div
      className={`relative flex flex-col gap-3 p-5 rounded-2xl border active:cursor-grabbing group select-none
        ${cardTheme} 
        ${hoverEffect}
        ${overlayEffect}
        ${isJustCompleted ? 'animate-pop' : ''}
      `}
    >
      {isJustCompleted && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <Sparkles className="absolute -top-6 -left-2 text-[#F5C842] particle" style={{ animationDelay: '0ms' }} size={24} />
          <Sparkles className="absolute -top-8 right-10 text-[#C8980A] particle" style={{ animationDelay: '100ms' }} size={16} />
          <Sparkles className="absolute top-1/2 -right-6 text-green-400 particle" style={{ animationDelay: '50ms' }} size={20} />
          <Sparkles className="absolute -bottom-6 left-1/4 text-[#F5C842] particle" style={{ animationDelay: '150ms' }} size={18} />
        </div>
      )}

      <div className="flex justify-between items-start">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
          isCompleted ? 'bg-white/50 border-green-200 text-green-600' : 
          isDoing ? 'bg-[#FEFBF0] border-[#F5E199] text-[#C8980A]' : 
          'bg-[#F8F8F8] border-[#EBEBEB] text-[#bbb]'
        }`}>
          {task.tag}
        </span>
        
        <div className={`transition-colors duration-300 ${isCompleted ? 'text-green-500' : 'text-[#ccc] group-hover:text-[#0E0E0E]'}`}>
          {isCompleted ? <CheckCircle2 size={20} /> : <GripVertical size={18} />}
        </div>
      </div>

      <div className="flex items-start gap-3 mt-1">
        <div className="mt-1.5 flex-shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full ${
            isCompleted ? 'bg-green-400' : 
            isDoing ? 'bg-[#F5C842] animate-pulse' : 
            'bg-[#ccc]'
          }`} />
        </div>
        
        <span className={`text-[15px] font-bold leading-tight ${
          isCompleted ? 'line-through text-[#aaa]' : 'text-[#0E0E0E]'
        }`}>
          {task.title}
        </span>
      </div>
      
      <div className={`flex justify-between items-center mt-2 pt-3 border-t ${isCompleted ? 'border-green-100' : 'border-[#F2F2F2]'}`}>
        <span className={`text-[11px] font-bold tracking-widest uppercase ${isCompleted ? 'text-[#aaa]' : 'text-[#ccc]'}`}>
          ID: STD-{task.id}
        </span>
      </div>
    </div>
  );
}