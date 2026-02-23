import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CircleDashed, Clock, CheckCircle2, GripVertical, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getTasksByLevelId, updateTaskStatus } from "../services/api";

const COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    iconEl: <CircleDashed size={16} className="text-[#bbb]" />,
    iconBg: "bg-[#F5F5F5]",
    countClass: "bg-[#F5F5F5] text-[#999] border-[#EBEBEB]",
  },
  {
    id: "doing",
    title: "In Progress",
    iconEl: <Clock size={16} className="text-[#F5C842]" />,
    iconBg: "bg-[#FEFBF0]",
    countClass: "bg-[#FEFBF0] text-[#C8980A] border-[#F5E199]",
  },
  {
    id: "completed",
    title: "Completed",
    iconEl: <CheckCircle2 size={16} className="text-green-400" />,
    iconBg: "bg-green-50",
    countClass: "bg-green-50 text-green-600 border-green-100",
  },
];

const COLUMN_ORDER = { todo: 0, doing: 1, completed: 2 };

const styles = `
  @keyframes pop-card {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.05) translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
    100% { transform: scale(1) translateY(0); }
  }
  .animate-pop { animation: pop-card 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  @keyframes float-up {
    0%   { transform: translateY(0) scale(0.5); opacity: 1; }
    100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
  }
  .particle { animation: float-up 0.8s ease-out forwards; }
`;

// Shorten long UUID-style IDs to last 6 chars
const formatId = (id) => {
  if (!id) return "—";
  const clean = String(id).replace(/-/g, "");
  return "STD-" + clean.slice(-6).toUpperCase();
};

export default function Trello() {
  const [tasks, setTasks] = useState({ todo: [], doing: [], completed: [] });
  const [justCompletedId, setJustCompletedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  const location = useLocation();
  const level_id = location.state?.level_id;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!level_id) return;
    const fetchTasksForLevel = async () => {
      try {
        const response = await getTasksByLevelId(level_id);
        if (response.data.success) {
          const tasksData = response.data.tasks;
          const grouped = { todo: [], doing: [], completed: [] };
          tasksData.forEach((task) => {
            let mappedStatus = "todo";
            if (task.status === "progress")   mappedStatus = "doing";
            else if (task.status === "completed") mappedStatus = "completed";
            else if (task.status === "locked" || task.status === "incomplete") mappedStatus = "todo";
            grouped[mappedStatus].push({
              id: String(task.id),
              title: task.taskName,
              status: mappedStatus,
              tag: "Task",
            });
          });
          setTasks(grouped);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasksForLevel();
  }, [level_id]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceCol = source.droppableId;
    const destCol   = destination.droppableId;

    // Only allow moving forward (todo → doing → completed)
    if (COLUMN_ORDER[destCol] < COLUMN_ORDER[sourceCol]) return;

    const sourceTasks = Array.from(tasks[sourceCol]);
    const destTasks   = sourceCol === destCol ? sourceTasks : Array.from(tasks[destCol]);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, { ...movedTask, status: destCol });

    // ✅ Snapshot for rollback
    const previousTasks = { ...tasks };

    // ✅ Optimistic UI update immediately
    setTasks((prev) => ({
      ...prev,
      [sourceCol]: sourceCol === destCol ? destTasks : sourceTasks,
      [destCol]:   destTasks,
    }));

    // ✅ Fire completion animation immediately (not waiting for API)
    if (sourceCol !== "completed" && destCol === "completed") {
      setJustCompletedId(draggableId);
      setTimeout(() => setJustCompletedId(null), 1200);
    }

    // ✅ Then sync with backend
    try {
      await updateTaskStatus(draggableId, destCol);
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Rollback UI to previous state if API fails
      setTasks(previousTasks);
    }
  };

  const allTasks      = Object.values(tasks).flat();
  const totalTasks    = allTasks.length;
  const doneCount     = tasks.completed.length;
  const boardProgress = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-6 md:px-10 py-16 flex flex-col items-center font-sans">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Header */}
      <div className={`text-center mb-4 transition-all duration-700 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-[#bbb] mb-2">Project Workflow</p>
        <h1
          className="font-black text-[#0E0E0E] tracking-tight"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
        >
          Sprint Board
        </h1>
        <p className="text-[17px] text-[#999] mt-3">Drag and drop tasks to update your progress.</p>

        {totalTasks > 0 && (
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center gap-3 bg-white border border-[#EBEBEB] rounded-2xl px-5 py-2.5 shadow-sm">
              <div className="w-28 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F5C842] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${boardProgress}%` }}
                />
              </div>
              <span className="text-[12px] font-black text-[#0E0E0E]">{boardProgress}%</span>
              <span className="text-[12px] text-[#bbb] font-medium">{doneCount}/{totalTasks} tasks</span>
            </div>
          </div>
        )}
      </div>

      {/* Board */}
      <div
        className={`w-full flex justify-center mt-8 transition-all duration-1000 delay-100 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        style={{ maxWidth: "1400px" }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                col={col}
                items={tasks[col.id] || []}
                justCompletedId={justCompletedId}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

function Column({ col, items, justCompletedId }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="flex flex-col bg-white rounded-3xl border border-[#EBEBEB] shadow-sm overflow-hidden">

      {/* ── Column Header ── */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-[#F2F2F2]">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${col.iconBg}`}>
            {col.iconEl}
          </div>
          <div>
            <h2 className="text-[13px] font-black tracking-widest uppercase text-[#0E0E0E] leading-none">
              {col.title}
            </h2>
            {col.id === "doing" && safeItems.length > 0 && (
              <p className="text-[10px] text-[#C8980A] font-semibold mt-0.5">Active sprint</p>
            )}
          </div>
        </div>
        <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${col.countClass}`}>
          {safeItems.length}
        </span>
      </div>

      {/* ── Drop Zone ── */}
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 flex flex-col gap-3 min-h-[500px] rounded-b-3xl transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-[#FFFDF0]" : "bg-[#FCFCFC]"
            }`}
          >
            {safeItems.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      isOverlay={snapshot.isDragging}
                      isJustCompleted={justCompletedId === task.id}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {safeItems.length === 0 && (
              <div className={`flex-1 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-10 transition-colors duration-200 ${
                snapshot.isDraggingOver
                  ? "border-[#F5C842] bg-[#FFFDF4]"
                  : "border-[#E8E8E8] bg-white"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  snapshot.isDraggingOver ? "bg-[#FEFBF0]" : "bg-[#F5F5F5]"
                }`}>
                  {col.iconEl}
                </div>
                <p className={`text-[11px] font-bold tracking-widest uppercase ${
                  snapshot.isDraggingOver ? "text-[#C8980A]" : "text-[#ccc]"
                }`}>
                  {snapshot.isDraggingOver ? "Release to drop" : "No tasks yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function TaskCard({ task, isOverlay, isJustCompleted }) {
  const isCompleted = task.status === "completed";
  const isDoing     = task.status === "doing";

  const cardBase = isCompleted
    ? "bg-green-50 border-green-100"
    : isDoing
    ? "bg-white border-[#EBEBEB] border-l-[3px] border-l-[#F5C842]"
    : "bg-white border-[#EBEBEB]";

  const hoverClass = isOverlay
    ? "scale-[1.02] shadow-[0_16px_40px_rgba(0,0,0,0.1)] border-[#F5C842] ring-2 ring-[#F5C842]/20 cursor-grabbing bg-white"
    : "hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] hover:border-[#D8D8D8] transition-all duration-150 cursor-grab active:cursor-grabbing shadow-[0_1px_3px_rgba(0,0,0,0.05)]";

  return (
    <div className={`relative flex flex-col rounded-2xl border select-none group overflow-hidden
      ${cardBase} ${hoverClass} ${isJustCompleted ? "animate-pop" : ""}
    `}>

      {isJustCompleted && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <Sparkles className="absolute -top-6 -left-2 text-[#F5C842] particle" style={{ animationDelay: "0ms" }}   size={24} />
          <Sparkles className="absolute -top-8 right-10 text-[#C8980A] particle" style={{ animationDelay: "100ms" }} size={16} />
          <Sparkles className="absolute top-1/2 -right-6 text-green-400 particle" style={{ animationDelay: "50ms" }}  size={20} />
          <Sparkles className="absolute -bottom-6 left-1/4 text-[#F5C842] particle" style={{ animationDelay: "150ms" }} size={18} />
        </div>
      )}

      {/* In-progress top accent line */}
      {isDoing && <div className="h-0.5 w-full bg-gradient-to-r from-[#F5C842] to-[#F5C842]/10" />}

      <div className="p-5 flex flex-col gap-3">
        {/* Tag + grip */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
            isCompleted ? "bg-white/50 border-green-200 text-green-600"
            : isDoing   ? "bg-[#FEFBF0] border-[#F5E199] text-[#C8980A]"
                        : "bg-[#F8F8F8] border-[#EBEBEB] text-[#bbb]"
          }`}>
            {task.tag}
          </span>
          <div className={`transition-colors duration-200 ${
            isCompleted ? "text-green-400" : "text-[#ddd] group-hover:text-[#aaa]"
          }`}>
            {isCompleted ? <CheckCircle2 size={17} /> : <GripVertical size={16} />}
          </div>
        </div>

        {/* Status dot + title */}
        <div className="flex items-start gap-2.5">
          <div className="mt-[5px] flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${
              isCompleted ? "bg-green-400"
              : isDoing   ? "bg-[#F5C842] animate-pulse"
                          : "bg-[#ddd]"
            }`} />
          </div>
          <span className={`text-[14px] font-bold leading-snug ${
            isCompleted ? "line-through text-[#aaa]" : "text-[#0E0E0E]"
          }`}>
            {task.title}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center px-5 py-3 border-t ${
        isCompleted ? "border-green-100 bg-green-50/50" : "border-[#F2F2F2] bg-[#FAFAFA]"
      }`}>
        <span className={`text-[10px] font-bold tracking-wide tabular-nums ${
          isCompleted ? "text-green-400" : "text-[#ccc]"
        }`}>
          {formatId(task.id)}
        </span>
      </div>
    </div>
  );
}