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

const Schedule = ({ kanbanEvents = [] }) => {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [mounted,     setMounted]     = useState(false);
  const [streak,      setStreak]      = useState(0);

  // Use events passed from Kanban board
  const events = kanbanEvents;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Re-render every minute so countdown stays live
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Streak calculation
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
  }, [events]);

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

  // Progress
  const totalEvents     = events.length;
  const completedEvents = events.filter((e) => e.completed).length;
  const progress        = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

  // This week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const thisWeekEvents    = events.filter((e) => {
    const eventStart = new Date(e.year, e.month, e.startDay, 0, 0, 0);
    const eventEnd   = new Date(e.year, e.month, e.endDay,   23, 59, 59);
    return eventStart <= endOfWeek && eventEnd >= startOfWeek;
  });
  const thisWeekCount     = thisWeekEvents.length;
  const thisWeekCompleted = thisWeekEvents.filter((e) => e.completed).length;

  const unlockedMilestone = [...MILESTONES].reverse().find((m) => progress >= m.threshold);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', -apple-system, sans-serif; }
        .fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <div className="min-h-screen bg-[#F8F8F8] px-10 py-16 flex flex-col items-center">

        {/* Header */}
        <div className={`fade-up ${mounted ? "visible" : ""} text-center mb-10`}>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#bbb] mb-2">Your Timeline</p>
          <h1
            className="font-black text-[#0E0E0E] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
          >
            Schedule & Milestones
          </h1>
          <p className="text-[17px] text-[#999] mt-3">Track your career roadmap deadlines and sessions.</p>
        </div>

        {/* ── Progress Dashboard ── */}
        <div
          className={`fade-up ${mounted ? "visible" : ""} w-full mb-8`}
          style={{ maxWidth: "1400px", transitionDelay: "60ms" }}
        >
          <div className="bg-white rounded-3xl border border-[#EBEBEB] p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* Progress Bar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-black tracking-widest uppercase text-[#bbb]">Overall Progress</p>
                  <span className="text-[22px] font-black text-[#0E0E0E]">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F5C842] rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-[#bbb]">{completedEvents} of {totalEvents} tasks completed</span>
                  {totalEvents === 0 && (
                    <span className="text-[11px] text-[#ddd]">Events will appear from your Kanban board</span>
                  )}
                </div>

                {/* Phase Markers */}
                <div className="flex gap-2 mt-5">
                  {MILESTONES.map((m) => (
                    <div key={m.threshold} className="flex-1">
                      <div className={`h-1.5 rounded-full mb-1.5 transition-colors duration-500 ${progress >= m.threshold ? "bg-[#F5C842]" : "bg-[#F0F0F0]"}`} />
                      <p className={`text-[9px] font-bold tracking-wide text-center ${progress >= m.threshold ? "text-[#C8980A]" : "text-[#ddd]"}`}>
                        {m.threshold}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block w-px self-stretch bg-[#F2F2F2]" />

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#0E0E0E]">
                    {thisWeekCompleted}
                    <span className="text-[#bbb] text-xl">/{thisWeekCount}</span>
                  </p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#bbb] mt-1">This Week</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-[#0E0E0E]">{completedEvents}</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#bbb] mt-1">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-[#0E0E0E]">{streak}</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#bbb] mt-1">Day Streak 🔥</p>
                </div>
              </div>

              <div className="hidden lg:block w-px self-stretch bg-[#F2F2F2]" />

              {/* Milestone */}
              <div className="w-full lg:w-64">
                <p className="text-[11px] font-black tracking-widest uppercase text-[#bbb] mb-3">Current Milestone</p>
                {unlockedMilestone ? (
                  <div className="bg-[#FEFBF0] border border-[#F5E199] rounded-2xl p-4">
                    <p className="text-2xl mb-1">{unlockedMilestone.icon}</p>
                    <p className="text-[13px] font-black text-[#C8980A]">{unlockedMilestone.label}</p>
                    <p className="text-[11px] text-[#C8980A]/70 mt-1">{unlockedMilestone.reward}</p>
                  </div>
                ) : (
                  <div className="bg-[#F5F5F5] rounded-2xl p-4">
                    <p className="text-2xl mb-1">🎯</p>
                    <p className="text-[13px] font-bold text-[#bbb]">Complete 25% to unlock</p>
                    <p className="text-[11px] text-[#ddd] mt-1">Events come from your Kanban board</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Calendar + Events ── */}
        <div
          className={`fade-up ${mounted ? "visible" : ""} w-full flex flex-col lg:flex-row gap-8`}
          style={{ maxWidth: "1400px", transitionDelay: "120ms" }}
        >

          {/* Calendar */}
          <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-12 shadow-sm">

            <div className="flex items-center justify-between mb-10">
              <button onClick={prevMonth}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors text-[#999] hover:text-[#0E0E0E] text-3xl">
                ‹
              </button>
              <span className="text-[24px] font-black text-[#0E0E0E] tracking-tight">
                {MONTHS[month]} {year}
              </span>
              <button onClick={nextMonth}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors text-[#999] hover:text-[#0E0E0E] text-3xl">
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
                return (
                  <div key={i}
                    onClick={() => day && setSelectedDay(day)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl text-[17px] font-semibold transition-all cursor-pointer
                      ${!day ? "pointer-events-none" : "hover:bg-[#F5F5F5]"}
                      ${selected ? "bg-[#0E0E0E] text-white hover:bg-[#0E0E0E]" : ""}
                      ${todayCell && !selected ? "border-2 border-[#F5C842]" : ""}
                      ${!selected && !todayCell ? "text-[#0E0E0E]" : ""}
                    `}
                  >
                    {day}
                    {hasEvent && (
                      <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${allDone ? "bg-green-400" : "bg-[#F5C842]"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#F2F2F2]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F5C842]" />
                <span className="text-[12px] text-[#bbb] font-medium">Has event</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-[12px] text-[#bbb] font-medium">All done</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md border-2 border-[#F5C842]" />
                <span className="text-[12px] text-[#bbb] font-medium">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-[#0E0E0E]" />
                <span className="text-[12px] text-[#bbb] font-medium">Selected</span>
              </div>
            </div>
          </div>

          {/* Events Panel */}
          <div className="w-full lg:w-[420px] flex flex-col gap-5">

            <div className="bg-[#F5C842] rounded-3xl p-8">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#C8980A] mb-1">Selected</p>
              <p className="text-6xl font-black text-[#0E0E0E] tracking-tight">{selectedDay}</p>
              <p className="text-[16px] font-semibold text-[#0E0E0E]/70 mt-2">
                {new Date(year, month, selectedDay).toLocaleDateString("en-US", { weekday: "long" })},{" "}
                {MONTHS[month]} {year}
              </p>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-7 shadow-sm">
              <p className="text-[12px] font-black tracking-widest uppercase text-[#bbb] mb-6">Events</p>

              {selectedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
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
                <div className="flex flex-col gap-4">
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
                          <p className={`text-[15px] font-bold ${
                            event.completed ? "line-through text-[#aaa]" : "text-[#0E0E0E]"
                          }`}>
                            {event.title}
                          </p>
                          <p className="text-[12px] text-[#bbb] font-medium mt-0.5">{event.time}</p>

                          {/* Date range */}
                          {event.startDay !== event.endDay && (
                            <p className="text-[11px] font-semibold text-[#C8980A] mt-1">
                              📅 {MONTHS[event.month].slice(0, 3)} {event.startDay} → {MONTHS[event.month].slice(0, 3)} {event.endDay}
                            </p>
                          )}

                          {/* Countdown */}
                          {!event.completed && (
                            <p className={`text-[11px] font-semibold mt-1 ${remaining.color}`}>
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
    </>
  );
};

export default Schedule;