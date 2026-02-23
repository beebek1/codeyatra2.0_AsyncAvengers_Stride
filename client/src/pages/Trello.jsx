import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CircleDashed, Clock, CheckCircle2, GripVertical, Sparkles } from "lucide-react";

const rawTasks = [
  { id: "1", title: "Design Landing Page", status: "todo", tag: "Design" },
  { id: "2", title: "Setup Authentication", status: "todo", tag: "Backend" },
  { id: "3", title: "Build Dashboard UI", status: "doing", tag: "Frontend" },
  { id: "4", title: "Connect API", status: "doing", tag: "Integration" },
  { id: "5", title: "Deploy Project", status: "completed", tag: "DevOps" },
];

const COLUMNS = [
  { id: "todo", title: "To Do", icon: <CircleDashed size={20} className="text-[#ccc]" /> },
  { id: "doing", title: "In Progress", icon: <Clock size={20} className="text-[#F5C842]" /> },
  { id: "completed", title: "Completed", icon: <CheckCircle2 size={20} className="text-green-400" /> },
];

const COLUMN_ORDER = { todo: 0, doing: 1, completed: 2 };

const styles = `
  @keyframes pop-card {
    0% { transform: scale(1); }
    40% { transform: scale(1.05) translateY(-4px) rotate(1deg); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
    100% { transform: scale(1) translateY(0) rotate(0); }
  }
  .animate-pop { animation: pop-card 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  @keyframes float-up {
    0% { transform: translateY(0) scale(0.5); opacity: 1; }
    100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
  }
  .particle { animation: float-up 0.8s ease-out forwards; }
`;

export default function Trello() {
  const [tasks, setTasks] = useState(() => {
    const initial = { todo: [], doing: [], completed: [] };
    rawTasks.forEach((task) => {
      if (initial[task.status]) initial[task.status].push(task);
    });
    return initial;
  });

  const [justCompletedId, setJustCompletedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Only allow moving forward
    if (COLUMN_ORDER[destCol] < COLUMN_ORDER[sourceCol]) return;

    const sourceTasks = Array.from(tasks[sourceCol]);
    const destTasks = sourceCol === destCol ? sourceTasks : Array.from(tasks[destCol]);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destCol };
    destTasks.splice(destination.index, 0, updatedTask);

    if (sourceCol !== "completed" && destCol === "completed") {
      setJustCompletedId(draggableId);
      setTimeout(() => setJustCompletedId(null), 1200);
    }

    setTasks((prev) => ({
      ...prev,
      [sourceCol]: sourceCol === destCol ? destTasks : sourceTasks,
      [destCol]: destTasks,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-6 md:px-10 py-16 flex flex-col items-center font-sans">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div
        className={`text-center mb-12 transition-all duration-700 ease-out transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <p className="text-[12px] font-semibold tracking-widest uppercase text-[#bbb] mb-2">
          Project Workflow
        </p>
        <h1
          className="font-black text-[#0E0E0E] tracking-tight"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
        >
          Sprint Board
        </h1>
        <p className="text-[17px] text-[#999] mt-3">
          Drag and drop tasks to update your progress.
        </p>
      </div>

      <div
        className={`w-full flex justify-center transition-all duration-1000 delay-100 ease-out transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ maxWidth: "1400px" }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
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
        </DragDropContext>
      </div>
    </div>
  );
}

function Column({ id, title, icon, items, justCompletedId }) {
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-[#EBEBEB] shadow-sm">
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

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-6 flex flex-col gap-4 min-h-[500px] rounded-b-3xl transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-[#FEFBF0]" : "bg-[#FCFCFC]"
            }`}
          >
            {items.map((task, index) => (
              <DraggableTask
                key={task.id}
                task={task}
                index={index}
                isJustCompleted={justCompletedId === task.id}
              />
            ))}
            {provided.placeholder}
            {items.length === 0 && (
              <div className="w-full h-28 border-2 border-dashed border-[#EBEBEB] rounded-2xl flex items-center justify-center bg-white">
                <p className="text-[12px] font-bold tracking-widest uppercase text-[#ccc]">
                  Drop Here
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function DraggableTask({ task, index, isJustCompleted }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TaskCard task={task} isOverlay={snapshot.isDragging} isJustCompleted={isJustCompleted} />
        </div>
      )}
    </Draggable>
  );
}

function TaskCard({ task, isOverlay, isJustCompleted }) {
  const isTodo = task.status === "todo";
  const isDoing = task.status === "doing";
  const isCompleted = task.status === "completed";

  const cardTheme = isCompleted
    ? "bg-green-50 border-green-100"
    : isDoing
    ? "bg-white border-[#EBEBEB] border-l-4 border-l-[#F5C842]"
    : "bg-white border-[#EBEBEB]";

  return (
    <div
      className={`relative flex flex-col gap-3 p-5 rounded-2xl border select-none group shadow-sm
        ${cardTheme}
        ${isOverlay ? "scale-[1.02] shadow-xl border-[#F5C842] cursor-grabbing" : "cursor-grab hover:-translate-y-1 hover:shadow-md transition-all duration-200"}
        ${isJustCompleted ? "animate-pop" : ""}
      `}
    >
      {isJustCompleted && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <Sparkles className="absolute -top-6 -left-2 text-[#F5C842] particle" style={{ animationDelay: "0ms" }} size={24} />
          <Sparkles className="absolute -top-8 right-10 text-[#C8980A] particle" style={{ animationDelay: "100ms" }} size={16} />
          <Sparkles className="absolute top-1/2 -right-6 text-green-400 particle" style={{ animationDelay: "50ms" }} size={20} />
          <Sparkles className="absolute -bottom-6 left-1/4 text-[#F5C842] particle" style={{ animationDelay: "150ms" }} size={18} />
        </div>
      )}

      <div className="flex justify-between items-start">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
            isCompleted
              ? "bg-white/50 border-green-200 text-green-600"
              : isDoing
              ? "bg-[#FEFBF0] border-[#F5E199] text-[#C8980A]"
              : "bg-[#F8F8F8] border-[#EBEBEB] text-[#bbb]"
          }`}
        >
          {task.tag}
        </span>
        <div className={`transition-colors duration-300 ${isCompleted ? "text-green-500" : "text-[#ccc] group-hover:text-[#0E0E0E]"}`}>
          {isCompleted ? <CheckCircle2 size={20} /> : <GripVertical size={18} />}
        </div>
      </div>

      <div className="flex items-start gap-3 mt-1">
        <div className="mt-1.5 flex-shrink-0">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isCompleted ? "bg-green-400" : isDoing ? "bg-[#F5C842] animate-pulse" : "bg-[#ccc]"
            }`}
          />
        </div>
        <span
          className={`text-[15px] font-bold leading-tight ${
            isCompleted ? "line-through text-[#aaa]" : "text-[#0E0E0E]"
          }`}
        >
          {task.title}
        </span>
      </div>

      <div
        className={`flex justify-between items-center mt-2 pt-3 border-t ${
          isCompleted ? "border-green-100" : "border-[#F2F2F2]"
        }`}
      >
        <span
          className={`text-[11px] font-bold tracking-widest uppercase ${
            isCompleted ? "text-[#aaa]" : "text-[#ccc]"
          }`}
        >
          ID: STD-{task.id}
        </span>
      </div>
    </div>
  );
}