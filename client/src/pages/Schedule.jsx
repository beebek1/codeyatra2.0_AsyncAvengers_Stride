import React, { useState, useEffect } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MILESTONES = [
  { threshold: 25,  label: "Getting Started",          reward: "Keep building momentum!",              icon: "🌱" },
  { threshold: 50,  label: "Portfolio Tips Unlocked",  reward: "Time to build your portfolio!",        icon: "💼" },
  { threshold: 75,  label: "Mock Interview Checklist", reward: "You're interview-ready!",              icon: "🎯" },
  { threshold: 100, label: "Certificate Suggestions",  reward: "Explore certifications to stand out!", icon: "🏆" },
];

const getDaysRemaining = (event) => {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const eventStart = new Date(event.year, event.month, event.startDay, 0, 0, 0);
  const diff = Math.ceil((eventStart - todayMidnight) / (1000 * 60 * 60 * 24));
  if (diff < 0)  return "past";
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  return `${diff} days left`;
};

const getTimeRemaining = (eventTime) => {
  try {
    const [timePart, period] = eventTime.split(" ");
    if (!timePart || !period) return null;
    let [hours, minutes] = timePart.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    const diff = target - new Date();
    if (diff <= 0) return "passed";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  } catch {
    return null;
  }
};

const getRemainingLabel = (event) => {
  const days = getDaysRemaining(event);
  if (days === "past")     return { label: "Past",        color: "text-[#ccc]" };
  if (days === "tomorrow") return { label: "Tomorrow",    color: "text-[#C8980A]" };
  if (days === "today") {
    const t = getTimeRemaining(event.time);
    if (!t || t === "passed") return { label: "Time passed", color: "text-[#ccc]" };
    return { label: `⏱ ${t}`, color: "text-[#F5C842]" };
  }
  return { label: `⏱ ${days}`, color: "text-[#C8980A]" };
};

export default function Schedule({ kanbanEvents = [] }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [mounted,     setMounted]     = useState(false);
  const [streak,      setStreak]      = useState(0);

  // Directly sourcing from Kanban prop
  const events = kanbanEvents;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Re-render every minute so countdown stays live
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Streak calculation based on Kanban completed events
  useEffect(() => {
    let count = 0;
    const checkDate = new Date(today);
    checkDate.setHours(0, 0, 0, 0);
    while (true) {
      const d = checkDate.getDate();
      const m = checkDate.getMonth();
      const y = checkDate.getFullYear();
      const hasCompleted = events.some(
        (e) => e.completed && e.month === m && e.year === y && e.startDay <= d && e.endDay >= d
      );
      if (!hasCompleted) break;
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    setStreak(count);
  }, [events, today]);

  const year        = currentDate.getFullYear();
  const month       = currentDate.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const getEventsForDay = (day) =>
    events.filter((e) => e.month === month && e.year === year && e.startDay <= day && e.endDay >= day);

  const selectedEvents = getEventsForDay(selectedDay);

  // Kanban Progress Calculations
  const totalEvents     = events.length;
  const completedEvents = events.filter((e) => e.completed).length;
  const progress        = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
  
  const unlockedMilestone = [...MILESTONES].reverse().find((m) => progress >= m.threshold);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-16 flex flex-col items-center font-sans">

      {/* Header */}
      <div className={`text-center mb-10 transition-all duration-700 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <p className="text-[12px] font-semibold tracking-widest uppercase text-[#bbb] mb-2">Your Timeline</p>
        <h1
          className="font-black text-[#0E0E0E] tracking-tight"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
        >
          Schedule & Milestones
        </h1>
        <p className="text-[17px] text-[#999] mt-3">Track your career roadmap deadlines and sessions.</p>
      </div>

      {/* Main Container */}
      <div className={`w-full flex flex-col lg:flex-row gap-8 transition-all duration-1000 delay-100 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`} style={{ maxWidth: "1400px" }}>

        {/* ── Calendar (Left Pane) ── */}
        <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-12 shadow-sm">

          <div className="flex items-center justify-between mb-10">
            {/* ADDED cursor-pointer here */}
            <button onClick={prevMonth}
              className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#F5F5F5] transition-colors text-[#999] hover:text-[#0E0E0E] text-3xl">
              ‹
            </button>
            <span className="text-[24px] font-black text-[#0E0E0E] tracking-tight">
              {MONTHS[month]} {year}
            </span>
            {/* ADDED cursor-pointer here */}
            <button onClick={nextMonth}
              className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#F5F5F5] transition-colors text-[#999] hover:text-[#0E0E0E] text-3xl">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[13px] font-bold tracking-widest uppercase text-[#ccc] py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {cells.map((day, i) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const hasEvent  = dayEvents.length > 0;
              const allDone   = hasEvent && dayEvents.every((e) => e.completed);
              
              const selected  = day === selectedDay;
              const todayCell = day !== null && isToday(day);
              
              let cellClasses = "relative aspect-square flex flex-col items-center justify-center rounded-2xl text-[17px] font-semibold transition-all cursor-pointer ";
              
              if (!day) {
                cellClasses += "pointer-events-none";
              } else if (selected && todayCell) {
                cellClasses += "bg-[#0E0E0E] text-[#F5C842]"; // Selected Today
              } else if (selected) {
                cellClasses += "bg-[#0E0E0E] text-white"; // Selected Normal
              } else if (todayCell) {
                cellClasses += "bg-[#F5C842] text-[#0E0E0E] hover:bg-[#E5B832] shadow-sm"; // Today (Unselected)
              } else {
                cellClasses += "text-[#0E0E0E] hover:bg-[#F5F5F5]"; // Normal Day
              }
              
              return (
                <div key={i}
                  onClick={() => day && setSelectedDay(day)}
                  className={cellClasses}
                >
                  {day}
                  
                  {/* Event indicator dot */}
                  {hasEvent && (
                    <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${
                      allDone ? "bg-green-400" : (selected && todayCell ? "bg-white" : selected ? "bg-[#F5C842]" : (todayCell ? "bg-black" : "bg-[#F5C842]"))
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-6 border-t border-[#F2F2F2]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F5C842]" />
              <span className="text-[12px] text-[#bbb] font-medium">Has event</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[12px] text-[#bbb] font-medium">All done</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#F5C842]" />
              <span className="text-[12px] text-[#bbb] font-medium">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#0E0E0E]" />
              <span className="text-[12px] text-[#bbb] font-medium">Selected</span>
            </div>
          </div>
        </div>

        {/* ── Events & Progress Panel (Right Pane) ── */}
        <div className="w-full lg:w-[420px] flex flex-col gap-5">

          {/* Selected Date Header */}
          <div className="bg-[#F5C842] rounded-3xl p-8 shadow-sm">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#C8980A] mb-1">Selected Date</p>
            <p className="text-6xl font-black text-[#0E0E0E] tracking-tight">{selectedDay}</p>
            <p className="text-[16px] font-semibold text-[#0E0E0E]/70 mt-2">
              {new Date(year, month, selectedDay).toLocaleDateString("en-US", { weekday: "long" })},{" "}
              {MONTHS[month]} {year}
            </p>
          </div>

          {/* Kanban Progress Tracker */}
          <div className="bg-white rounded-3xl border border-[#EBEBEB] p-7 shadow-sm">
            
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-black tracking-widest uppercase text-[#bbb]">Kanban Progress</p>
              <span className="text-[18px] font-black text-[#0E0E0E]">{progress}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#F5C842] rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {progress > 0 && <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />}
              </div>
            </div>

            {/* Empty State warning for Kanban */}
            {totalEvents === 0 && (
              <p className="text-[11px] text-[#C8980A] bg-[#FEFBF0] p-2 rounded-lg border border-[#F5E199] text-center mb-4">
                No tasks found. Add tasks to your Kanban board to see progress!
              </p>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAFAFA] border border-[#F2F2F2] rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-[#0E0E0E]">{streak}</p>
                <p className="text-[9px] font-bold tracking-widest uppercase text-[#bbb] mt-1">Day Streak 🔥</p>
              </div>
              <div className="bg-[#FAFAFA] border border-[#F2F2F2] rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-[#0E0E0E]">{completedEvents}<span className="text-lg text-[#ccc]">/{totalEvents}</span></p>
                <p className="text-[9px] font-bold tracking-widest uppercase text-[#bbb] mt-1">Tasks Done</p>
              </div>
            </div>

            {/* Current Milestone Alert */}
            {unlockedMilestone && (
              <div className="mt-4 bg-[#FEFBF0] border border-[#F5E199] rounded-2xl p-4 flex items-center gap-4">
                <div className="text-3xl bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                  {unlockedMilestone.icon}
                </div>
                <div>
                  <p className="text-[12px] font-black text-[#C8980A] uppercase tracking-wide">{unlockedMilestone.label}</p>
                  <p className="text-[11px] text-[#C8980A]/70 mt-0.5">{unlockedMilestone.reward}</p>
                </div>
              </div>
            )}
          </div>

          {/* Events List for Selected Day */}
          <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-7 shadow-sm flex flex-col">
            <p className="text-[12px] font-black tracking-widest uppercase text-[#bbb] mb-6">Daily Events</p>

            {selectedEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="#ccc" strokeWidth="2" />
                    <path d="M8 2v4M16 2v4M3 10h18" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[14px] text-[#ccc] font-medium">No events this day</p>
                <p className="text-[12px] text-[#ddd] mt-1">Add tasks from your Kanban board</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: '350px' }}>
                {selectedEvents.map((event) => {
                  const remaining = getRemainingLabel(event);
                  return (
                    <div key={event.id}
                      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                        event.completed ? "bg-green-50 border-green-100" : "bg-[#FAFAFA] border-[#F2F2F2]"
                      }`}
                    >
                      {/* Status dot */}
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                        event.completed ? "bg-green-400" : "bg-[#F5C842]"
                      }`} />

                      <div className="flex-1 min-w-0">
                        <p className={`text-[15px] font-bold leading-tight ${
                          event.completed ? "line-through text-[#aaa]" : "text-[#0E0E0E]"
                        }`}>
                          {event.title}
                        </p>
                        
                        {event.time && (
                           <p className="text-[12px] text-[#bbb] font-medium mt-1">{event.time}</p>
                        )}

                        {/* Date range if multi-day */}
                        {event.startDay !== event.endDay && (
                          <p className="text-[11px] font-semibold text-[#C8980A] mt-1.5">
                            📅 {MONTHS[event.month].slice(0, 3)} {event.startDay} → {MONTHS[event.month].slice(0, 3)} {event.endDay}
                          </p>
                        )}

                        {/* Countdown */}
                        {!event.completed && (
                          <p className={`text-[11px] font-bold tracking-wide uppercase mt-2 ${remaining.color}`}>
                            {remaining.label}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}