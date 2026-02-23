import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../assets/logo.png'
import { getMe } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  const navLinks = [
    { label: "Home",     path: "/"         },
    { label: "Schedule", path: "/schedule" },
    { label: "Career",   path: "/careers"  },
  ];

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    getUserDetail();
  }, []);

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

        .sliding-action-btn {
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          padding-left: 0;
          padding-right: 0;
          white-space: nowrap;
          transition: max-width 0.4s ease, opacity 0.3s ease, padding 0.3s ease;
        }
        .sliding-action-btn.visible {
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

      <div className="navbar-root w-full px-4 pt-4 pb-2 sticky top-0 z-1000 bg-transparent">
        <div className="max-w-3xl mx-auto relative" ref={menuRef}>

          <div className="flex items-center justify-between px-5 h-14 rounded-full bg-[#E6E6E6] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300">

            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                <img src="/favicon.png" alt="icon" className="w-full h-full object-cover" />
              </div>
              <span className="h-6 self-start">
                <img src={Logo} alt="Stride" className="h-full w-auto align-top" />
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors duration-150 cursor-pointer ${
                    isActive(link.path) ? "text-[#0E0E0E] bg-white shadow-sm" : "text-[#777] hover:text-[#0E0E0E]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => navigate("/account")}
                    className="w-9 h-9 rounded-full bg-[#F5C842] flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-transparent hover:border-white transition-all cursor-pointer"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[12px] font-bold text-[#0E0E0E]">
                        {user?.name?.charAt(0) ?? "U"}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => navigate("/account")}
                    className={`sliding-action-btn ${scrolled ? "visible" : ""} text-[14px] font-semibold bg-[#0E0E0E] text-white py-2 rounded-full cursor-pointer flex items-center gap-2`}
                  >
                    <span>{user?.name?.split(" ")[0] ?? "Account"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[14px] font-medium text-[#777] hover:text-[#0E0E0E] transition-colors cursor-pointer px-3 py-2"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className={`sliding-action-btn ${scrolled ? "visible" : ""} text-[14px] font-semibold bg-[#0E0E0E] hover:bg-[#2a2a2a] text-white py-2 rounded-full cursor-pointer`}
                  >
                    Get started
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}