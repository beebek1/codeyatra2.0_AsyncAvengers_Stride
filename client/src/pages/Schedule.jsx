import React, { useState, useEffect } from "react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
* { font-family: 'DM Sans', sans-serif !important; }`;

const MOCK_TASKS = [
  {
    task_id: "1",
    name: "Portfolio Wireframing",
    createdAt: "2026-02-05",
    timeline: "2026-02-12",
    status: "in-progress"
  },
  {
    task_id: "2",
    name: "Backend API Integration",
    createdAt: "2026-02-15",
    timeline: "2026-02-25",
    status: "todo"
  },
  {
    task_id: "3",
    name: "Testing Phase",
    createdAt: "2026-02-24",
    timeline: "2026-02-28",
    status: "todo"
  }
];

// Per-task color sets: bg highlight, dot, border, text
const TASK_COLORS = [
  { bg: "#F5C84220", dot: "#F5C842", border: "#F5C84260", label: "#C8980A" },
  { bg: "#60A5FA20", dot: "#60A5FA", border: "#60A5FA60", label: "#2563EB" },
  { bg: "#34D39920", dot: "#34D399", border: "#34D39960", label: "#059669" },
  { bg: "#F472B620", dot: "#F472B6", border: "#F472B660", label: "#DB2777" },
  { bg: "#A78BFA20", dot: "#A78BFA", border: "#A78BFA60", label: "#7C3AED" },
];

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const MILESTONES = [
  { threshold: 1, label: "Deadline Soon",           reward: "1 task due this week. Stay on track.",     icon: "🌱" },
  { threshold: 2, label: "Two Deadlines This Week",  reward: "2 tasks due soon. Prioritize now.",        icon: "⚡" },
  { threshold: 3, label: "Critical Week",            reward: "All tasks due this week. Clear your schedule.", icon: "🔥" },
];

// Parse MOCK_TASKS into calendar-compatible event objects
// Each task spans from createdAt to timeline, possibly across months
function parseTasks(tasks) {
  const events = [];
  tasks.forEach((task, index) => {
    const start = new Date(task.createdAt);
    const end   = new Date(task.timeline);
    const color = TASK_COLORS[index % TASK_COLORS.length];

    // Walk month by month so multi-month tasks get a segment per month
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= endMonth) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth();
      const daysInMonth = new Date(y, m + 1, 0).getDate();

      const segStart = (y === start.getFullYear() && m === start.getMonth())
        ? start.getDate()
        : 1;
      const segEnd = (y === end.getFullYear() && m === end.getMonth())
        ? end.getDate()
        : daysInMonth;

      events.push({
        id:       `${task.task_id}-${y}-${m}`,
        task_id:  task.task_id,
        title:    task.name,
        status:   task.status,
        startDay: segStart,
        endDay:   segEnd,
        month:    m,
        year:     y,
        color,
        completed: task.status === "done",
        fullStart: task.createdAt,
        fullEnd:   task.timeline,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }
  });
  return events;
}

const STATUS_LABEL = {
  "in-progress": "IN PROGRESS",
  "todo":        "TODO",
  "done":        "DONE",
};

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

const getRemainingLabel = (event) => {
  const days = getDaysRemaining(event);
  if (days === "past")     return { label: "Past",     color: "text-[#ccc]" };
  if (days === "tomorrow") return { label: "Tomorrow", color: "text-[#C8980A]" };
  if (days === "today")    return { label: "Today",    color: "text-[#F5C842]" };
  return { label: `⏱ ${days}`, color: "text-[#C8980A]" };
};

export default function Schedule({ kanbanEvents = [] }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026 to match mock data
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [mounted,     setMounted]     = useState(false);
  const [daysToLastDeadline, setDaysToLastDeadline] = useState(0);

  // Parsed MOCK_TASKS take priority; fall back to kanbanEvents if provided
  const parsedTasks = parseTasks(MOCK_TASKS);
  const events = parsedTasks.length > 0 ? parsedTasks : kanbanEvents;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const todayMs = new Date(); todayMs.setHours(0, 0, 0, 0);
    const lastDeadline = MOCK_TASKS.reduce((latest, t) => {
      const d = new Date(t.timeline); d.setHours(0, 0, 0, 0);
      return d > latest ? d : latest;
    }, todayMs);
    const diff = Math.ceil((lastDeadline - todayMs) / (1000 * 60 * 60 * 24));
    setDaysToLastDeadline(diff > 0 ? diff : 0);
  }, []);

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

  const totalEvents      = MOCK_TASKS.length;
  const todayMidnight   = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const in7Days         = new Date(todayMidnight); in7Days.setDate(in7Days.getDate() + 7);
  const completedEvents = MOCK_TASKS.filter((t) => new Date(t.timeline) < todayMidnight).length;
  const dueSoonCount    = MOCK_TASKS.filter((t) => {
    const d = new Date(t.timeline); d.setHours(0, 0, 0, 0);
    return d >= todayMidnight && d <= in7Days;
  }).length;
  const progress        = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

  // Badges unlock based on how many tasks are due within 7 days
  const unlockedMilestone = [...MILESTONES].reverse().find((m) => dueSoonCount >= m.threshold);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-16 flex flex-col items-center">
      <style>{FONT_IMPORT}</style>

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

        {/* Calendar */}
        <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-12 shadow-sm">

          <div className="flex items-center justify-between mb-10">
            <button onClick={prevMonth}
              className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#F5F5F5] transition-colors text-[#999] hover:text-[#0E0E0E] text-3xl">
              ‹
            </button>
            <span className="text-[24px] font-black text-[#0E0E0E] tracking-tight">
              {MONTHS[month]} {year}
            </span>
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
              const selected  = day === selectedDay;
              const todayCell = day !== null && isToday(day);

              // Use the first task's color for cell background when highlighted
              const firstColor = hasEvent ? dayEvents[0].color : null;

              let cellStyle = {};
              let cellClasses = "relative aspect-square flex flex-col items-center justify-center rounded-xl border text-[17px] font-semibold transition-all cursor-pointer ";

              if (!day) {
                cellClasses += "pointer-events-none border-transparent";
              } else if (selected && todayCell) {
                cellClasses += "bg-[#0E0E0E] text-[#F5C842] border-[#0E0E0E]";
              } else if (selected) {
                cellClasses += "bg-[#0E0E0E] text-white border-[#0E0E0E]";
              } else if (todayCell) {
                cellClasses += "bg-[#F5C842] text-[#0E0E0E] hover:bg-[#E5B832] shadow-sm border-[#F5C842]";
              } else if (hasEvent) {
                // Highlighted range cell: colored background from task color
                cellClasses += "text-[#0E0E0E] hover:opacity-80";
                cellStyle = {
                  backgroundColor: firstColor.bg,
                  borderColor: firstColor.border,
                };
              } else {
                cellClasses += "text-[#0E0E0E] hover:bg-[#F5F5F5] border-[#EDEDED]";
              }

              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDay(day)}
                  className={cellClasses}
                  style={cellStyle}
                >
                  <span className="text-[20px] font-bold leading-none">{day}</span>

                  {/* Stacked color dots — one per task active on this day */}
                  {hasEvent && (
                    <div className="absolute bottom-2 flex gap-1">
                      {dayEvents.map((e) => (
                        <span
                          key={e.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: selected || todayCell ? "#fff" : e.color.dot }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Pane */}
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

          {/* Progress Tracker */}
          <div className="bg-white rounded-3xl border border-[#EBEBEB] p-7 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-black tracking-widest uppercase text-[#bbb]">Deadlines Passed</p>
              <span className="text-[18px] font-black text-[#0E0E0E]">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#F5C842] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAFAFA] border border-[#F2F2F2] rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-[#0E0E0E]">{daysToLastDeadline}</p>
                <p className="text-[9px] font-bold tracking-widest uppercase text-[#bbb] mt-1">Days to Last Deadline 📅</p>
              </div>
              <div className="bg-[#FAFAFA] border border-[#F2F2F2] rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-[#0E0E0E]">
                  {completedEvents}<span className="text-lg text-[#ccc]">/{totalEvents}</span>
                </p>
                <p className="text-[9px] font-bold tracking-widest uppercase text-[#bbb] mt-1">Past Deadline</p>
              </div>
            </div>

            {unlockedMilestone && (
              <div className="mt-4 bg-[#FFF5F5] border border-[#FECACA] rounded-2xl p-4 flex items-center gap-4">
                <div className="text-3xl bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                  {unlockedMilestone.icon}
                </div>
                <div>
                  <p className="text-[12px] font-black text-[#DC2626] uppercase tracking-wide">{unlockedMilestone.label}</p>
                  <p className="text-[11px] text-[#DC2626]/70 mt-0.5">{unlockedMilestone.reward}</p>
                </div>
              </div>
            )}
          </div>

          {/* Events for Selected Day */}
          <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-7 shadow-sm flex flex-col">
            <p className="text-[12px] font-black tracking-widest uppercase text-[#bbb] mb-6">Active Tasks</p>

            {selectedEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="#ccc" strokeWidth="2" />
                    <path d="M8 2v4M16 2v4M3 10h18" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[14px] text-[#ccc] font-medium">No tasks this day</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto pr-1" style={{ maxHeight: "350px" }}>
                {selectedEvents.map((event) => {
                  const remaining = getRemainingLabel(event);
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-5 rounded-2xl border transition-all"
                      style={{
                        backgroundColor: event.color.bg,
                        borderColor: event.color.border,
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ backgroundColor: event.color.dot }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold leading-tight text-[#0E0E0E]">{event.title}</p>
                        <p
                          className="text-[10px] font-bold tracking-widest uppercase mt-1"
                          style={{ color: event.color.label }}
                        >
                          {STATUS_LABEL[event.status]}
                        </p>
                        <p className="text-[11px] font-semibold text-[#888] mt-1.5">
                          {event.fullStart} → {event.fullEnd}
                        </p>
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