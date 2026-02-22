import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../assets/logo.png'

const MOCK_USER = null;
// const MOCK_USER = { name: "Aryan Khan", avatar: null };

export default function Navbar({ user = MOCK_USER }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const navLinks = [
    { label: "Home",     path: "/"         },
    { label: "Schedule", path: "/schedule" },
    { label: "Career",   path: "/careers"  },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .navbar-root, .navbar-root * { font-family: 'DM Sans', -apple-system, sans-serif; }

        .get-started-btn {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          padding-left: 0;
          padding-right: 0;
          white-space: nowrap;
          transition: max-width 0.4s ease, opacity 0.3s ease, padding 0.3s ease;
        }
        .get-started-btn.visible {
          max-width: 160px;
          opacity: 1;
          padding-left: 20px;
          padding-right: 20px;
        }

        .mobile-drop {
          animation: dropIn 0.18s ease forwards;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>

      <div className="navbar-root w-full px-4 pt-4 pb-2 sticky top-0 z-50 bg-transparent">
        <div className="max-w-3xl mx-auto relative" ref={menuRef}>

          {/* Pill with added shadow */}
          <div className="flex items-center justify-between px-5 h-14 rounded-full bg-[#E6E6E6] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300">

            {/* Logo */}
            <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            >
            {/* The Icon Box */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
            <img 
                src="/favicon.png" 
                alt="icon" 
                className="w-full h-full object-cover" 
            />
            </div>

            {/* The Text Logo */}
            <span className="h-5 flex items-center">
                <img 
                src={Logo} 
                alt="Stride" 
                className="h-full w-auto object-contain" 
                />
            </span>
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors duration-150 cursor-pointer ${
                    isActive(link.path)
                      ? "text-[#0E0E0E] bg-white shadow-sm"
                      : "text-[#777] hover:text-[#0E0E0E]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                /* Logged in: profile button */
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white transition-colors duration-150 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F5C842] flex items-center justify-center flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-[11px] font-bold text-[#0E0E0E]">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-[14px] font-medium text-[#0E0E0E]">
                    {user.name.split(" ")[0]}
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`text-[#aaa] transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                /* Logged out: sign in + scroll-revealed get started */
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[14px] font-medium text-[#777] hover:text-[#0E0E0E] transition-colors duration-150 cursor-pointer px-3 py-2"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className={`get-started-btn ${scrolled ? "visible" : ""} text-[14px] font-semibold bg-[#0E0E0E] hover:bg-[#2a2a2a] text-white py-2 rounded-full transition-colors duration-150 cursor-pointer`}
                  >
                    Get started
                  </button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1"
              onClick={() => setMenuOpen((p) => !p)}
            >
              <span className={`block w-[18px] h-0.5 bg-[#0E0E0E] transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-[18px] h-0.5 bg-[#0E0E0E] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-[18px] h-0.5 bg-[#0E0E0E] transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>

          {/* Dropdown */}
          {menuOpen && (
            <div className="mobile-drop absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-lg border border-[#F0F0F0] overflow-hidden z-50">

              {/* Mobile nav links */}
              <div className="md:hidden flex flex-col px-3 pt-3 pb-2">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => { navigate(link.path); setMenuOpen(false); }}
                    className={`text-left px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors duration-150 cursor-pointer ${
                      isActive(link.path)
                        ? "text-[#0E0E0E] bg-[#F5F5F5]"
                        : "text-[#777] hover:text-[#0E0E0E] hover:bg-[#F8F8F8]"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <div className="border-t border-[#F2F2F2] mt-2 pt-3 px-1 flex flex-col gap-2 pb-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2.5 px-3 py-2">
                        <div className="w-7 h-7 rounded-full bg-[#F5C842] flex items-center justify-center">
                          <span className="text-[11px] font-bold text-[#0E0E0E]">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[14px] font-medium text-[#0E0E0E]">{user.name}</span>
                      </div>
                      <button className="text-left px-4 py-2.5 rounded-xl text-[14px] font-medium text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { navigate("/login"); setMenuOpen(false); }}
                        className="text-left px-4 py-2.5 rounded-xl text-[14px] font-medium text-[#777] hover:text-[#0E0E0E] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => { navigate("/signup"); setMenuOpen(false); }}
                        className="text-[14px] font-semibold bg-[#0E0E0E] text-white px-5 py-2.5 rounded-full text-center cursor-pointer"
                      >
                        Get started
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Desktop: logged-in dropdown */}
              {user && (
                <div className="hidden md:flex flex-col px-3 py-3 gap-1">
                  <button
                    onClick={() => { navigate("/roadmap"); setMenuOpen(false); }}
                    className="text-left px-4 py-2.5 rounded-xl text-[14px] font-medium text-[#777] hover:text-[#0E0E0E] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
                  >
                    My Roadmap
                  </button>
                  <button
                    onClick={() => { navigate("/settings"); setMenuOpen(false); }}
                    className="text-left px-4 py-2.5 rounded-xl text-[14px] font-medium text-[#777] hover:text-[#0E0E0E] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
                  >
                    Settings
                  </button>
                  <div className="border-t border-[#F2F2F2] mt-1 pt-2">
                    <button className="text-left w-full px-4 py-2.5 rounded-xl text-[14px] font-medium text-red-400 hover:bg-red-50 transition-colors cursor-pointer">
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}