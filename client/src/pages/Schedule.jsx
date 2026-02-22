import React, { useState, useEffect } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const TIME_OPTIONS = [
  "12:00 AM","12:30 AM",
  "1:00 AM","1:30 AM",
  "2:00 AM","2:30 AM",
  "3:00 AM","3:30 AM",
  "4:00 AM","4:30 AM",
  "5:00 AM","5:30 AM",
  "6:00 AM","6:30 AM",
  "7:00 AM","7:30 AM",
  "8:00 AM","8:30 AM",
  "9:00 AM","9:30 AM",
  "10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM",
  "1:00 PM","1:30 PM",
  "2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM",
  "4:00 PM","4:30 PM",
  "5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM",
  "7:00 PM","7:30 PM",
  "8:00 PM","8:30 PM",
  "9:00 PM","9:30 PM",
  "10:00 PM","10:30 PM",
  "11:00 PM","11:30 PM",
];

const Schedule = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "" });
  const [events, setEvents] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const year     = currentDate.getFullYear();
  const month    = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const selectedEvents = events[selectedDay] || [];

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    setEvents((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), { ...newEvent, color: "#F5C842" }],
    }));
    setNewEvent({ title: "", time: "" });
    setShowModal(false);
  };

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
        .time-scroll::-webkit-scrollbar { width: 4px; }
        .time-scroll::-webkit-scrollbar-track { background: transparent; }
        .time-scroll::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 999px; }
      `}</style>

      <div className="min-h-screen bg-[#F8F8F8] px-10 py-16 flex flex-col items-center">

        {/* Header */}
        <div className={`fade-up ${mounted ? "visible" : ""} text-center mb-14`} style={{ transitionDelay: "0ms" }}>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-[#bbb] mb-2">Your Timeline</p>
          <h1 className="font-black text-[#0E0E0E] tracking-tight" style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}>
            Schedule & Milestones
          </h1>
          <p className="text-[17px] text-[#999] mt-3">Track your career roadmap deadlines and sessions.</p>
        </div>

        <div className={`fade-up ${mounted ? "visible" : ""} w-full flex flex-col lg:flex-row gap-8`}
          style={{ maxWidth: "1400px", transitionDelay: "100ms" }}>

          {/* Calendar */}
          <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-12 shadow-sm">

            {/* Month Nav */}
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

            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-4">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[13px] font-bold tracking-widest uppercase text-[#ccc] py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-3">
              {cells.map((day, i) => {
                const hasEvent = day && events[day];
                const selected = day === selectedDay;
                const todayCell = day && isToday(day);
                return (
                  <div key={i}
                    onClick={() => day && setSelectedDay(day)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl text-[17px] font-semibold transition-all cursor-pointer
                      ${!day ? "" : "hover:bg-[#F5F5F5]"}
                      ${selected ? "bg-[#0E0E0E] text-white hover:bg-[#0E0E0E]" : ""}
                      ${todayCell && !selected ? "border-2 border-[#F5C842]" : ""}
                      ${!selected && !todayCell ? "text-[#0E0E0E]" : ""}
                    `}
                  >
                    {day}
                    {hasEvent && (
                      <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-[#F5C842]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#F2F2F2]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F5C842]" />
                <span className="text-[12px] text-[#bbb] font-medium">Has event</span>
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

            {/* Selected Date Header */}
            <div className="bg-[#F5C842] rounded-3xl p-8">
              <p className="text-[11px] font-black tracking-widest uppercase text-[#C8980A] mb-1">Selected</p>
              <p className="text-6xl font-black text-[#0E0E0E] tracking-tight">{selectedDay}</p>
              <p className="text-[16px] font-semibold text-[#0E0E0E]/70 mt-2">
                {new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long' })}, {MONTHS[month]} {year}
              </p>
            </div>

            {/* Events List */}
            <div className="flex-1 bg-white rounded-3xl border border-[#EBEBEB] p-7 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[12px] font-black tracking-widest uppercase text-[#bbb]">Events</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-9 h-9 bg-[#0E0E0E] text-white rounded-full flex items-center justify-center text-2xl leading-none hover:bg-[#333] transition-colors"
                >
                  +
                </button>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="3" stroke="#ccc" strokeWidth="2"/>
                      <path d="M8 2v4M16 2v4M3 10h18" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-[14px] text-[#ccc] font-medium">No events this day</p>
                  <p className="text-[12px] text-[#ddd] mt-1">Click + to add one</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {selectedEvents.map((event, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-[#FAFAFA] border border-[#F2F2F2]">
                      <div className="w-2 self-stretch min-h-[2rem] rounded-full flex-shrink-0"
                        style={{ backgroundColor: event.color }} />
                      <div>
                        <p className="text-[15px] font-bold text-[#0E0E0E]">{event.title}</p>
                        <p className="text-[13px] text-[#bbb] font-medium mt-0.5">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-3xl p-8 w-[90%] max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}>

              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-black text-[#0E0E0E] tracking-tight">New Event</h2>
                <button onClick={() => setShowModal(false)}
                  className="text-[#bbb] hover:text-[#0E0E0E] transition-colors text-xl">
                  ✕
                </button>
              </div>

              <p className="text-[14px] text-[#999] font-medium mb-6">
                {new Date(year, month, selectedDay).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-[15px] font-bold text-[#0E0E0E] mb-2 block">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Interview preparation"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-4 bg-[#F5F5F5] rounded-2xl text-[14px] text-[#0E0E0E] focus:outline-none focus:ring-2 focus:ring-[#F5C842] placeholder:text-[#bbb]"
                  />
                </div>

                <div>
                  <label className="text-[15px] font-bold text-[#0E0E0E] mb-2 block">Time</label>
                  <div className="w-full bg-[#F5F5F5] rounded-2xl overflow-hidden">
                    <div className="h-48 overflow-y-auto time-scroll">
                      {TIME_OPTIONS.map((time) => (
                        <div
                          key={time}
                          onClick={() => setNewEvent({ ...newEvent, time })}
                          className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors
                            ${newEvent.time === time
                              ? "bg-[#F5C842] text-[#0E0E0E] font-bold"
                              : "text-[#0E0E0E] hover:bg-[#EBEBEB]"
                            }`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                  {newEvent.time && (
                    <p className="text-[11px] text-[#999] mt-1.5 ml-1">
                      Selected: <span className="font-bold text-[#0E0E0E]">{newEvent.time}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl border border-[#EBEBEB] text-[14px] font-bold text-[#0E0E0E] hover:bg-[#F5F5F5] transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddEvent}
                  className="flex-1 py-4 rounded-2xl bg-[#F5C842] text-[14px] font-bold text-[#0E0E0E] hover:bg-[#e6b93a] transition-colors">
                  Add Event
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Schedule;