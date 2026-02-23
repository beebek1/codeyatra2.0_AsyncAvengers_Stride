import React, { useState, useEffect } from 'react';
import { getMe } from "../services/api";
import { auth } from "../services/firebase"; 
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { 
  User, 
  Mail, 
  MapPin, 
  Target, 
  Bell, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Briefcase
} from 'lucide-react';

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const [openDropdown, setOpenDropdown] = useState(null);

  // --- NEW: Notification State ---
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('stride_notify') === 'true'
  );

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(false); 
      if (!firebaseUser) {
        navigate('/login');
        return;
      }

      try {
        await firebaseUser.reload();
        const freshUser = auth.currentUser;

        const displayName =
          freshUser?.displayName ||
          freshUser?.email?.split('@')[0] ||
          "User";

        const response = await getMe();
        const backendUser = response.data.user;

        const formattedDate = new Date(backendUser.createdAt)
          .toLocaleDateString("en-US", { month: "short", year: "numeric" })
          .toUpperCase();

        setUser({
          name: displayName,
          email: backendUser.email || freshUser?.email,
          education: backendUser.educationLevel || "Not set",
          interest: backendUser.primaryInterest || "Not set",
          location: backendUser.location || "Not set",
          memberSince: formattedDate,
          tier: "BETA EXPLORER",
        });

      } catch (error) {
        console.error("Failed to fetch user:", error);
        try { await firebaseUser.reload(); } catch (_) {}
        const freshUser = auth.currentUser;

        setUser({
          name: freshUser?.displayName || freshUser?.email?.split('@')[0] || "User",
          email: freshUser?.email || "email@example.com",
          education: "Not set",
          interest: "Not set",
          location: "Not set",
          memberSince: "N/A",
          tier: "BETA EXPLORER",
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // --- NEW: 24-Hour Notification Logic ---
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkAndSendNotification = () => {
      if (Notification.permission === 'granted') {
        const lastNotify = parseInt(localStorage.getItem('stride_last_notify') || '0', 10);
        const now = Date.now();
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; 

        // If 24 hours have passed since the last notification
        if (now - lastNotify >= TWENTY_FOUR_HOURS) {
          new Notification("Daily Stride Update", {
            body: "Time to check your progress and conquer today's tasks!",
          });
          // Update the timer
          localStorage.setItem('stride_last_notify', now.toString());
        }
      }
    };

    // Check immediately when the app opens
    checkAndSendNotification();

    // Check every minute while the app is open to see if 24 hours just hit
    const intervalId = setInterval(checkAndSendNotification, 60000);

    return () => clearInterval(intervalId);
  }, [notificationsEnabled]);


  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      auth.signOut().then(() => navigate('/login'));  
    }
  };

  // --- UPGRADED: Notification Toggle Handlers ---
  const requestNotification = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        localStorage.setItem('stride_notify', 'true');
        
        // If they just enabled it, send a welcome notification and set the timer!
        new Notification("Notifications Enabled!", {
          body: "You're all set! You'll receive daily updates here."
        });
        localStorage.setItem('stride_last_notify', Date.now().toString());
        setNotificationsEnabled(true);
      } else {
        alert("You denied notification permissions. Please enable them in your browser settings.");
      }
    });
  };

  const disableNotification = () => {
    localStorage.removeItem('stride_notify');
    setNotificationsEnabled(false);
  };


  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#f5c842] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Loading account...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'Personal Info', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'Security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'Career Tracks', label: 'Career Tracks', icon: <Target size={18} /> },
    { id: 'Notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Personal Info':
        return (
          <div className="animate-in fade-in duration-500 relative">
            
            {/* Invisible overlay to close dropdown when clicking outside */}
            {openDropdown && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setOpenDropdown(null)} 
              />
            )}

            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black tracking-tight uppercase text-gray-900">Profile Settings</h3>
              <button 
                onClick={() => {
                  setIsEditing(!isEditing);
                  setOpenDropdown(null); 
                }} 
                className={`border-2 px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                  isEditing 
                    ? 'bg-[#f5c842] border-[#f5c842] text-black shadow-md shadow-[#f5c842]/20' 
                    : 'bg-transparent border-gray-200 text-gray-600 hover:border-black hover:text-black'
                }`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Full Name', value: user.name, key: 'name', icon: <User size={18} /> },
                { label: 'Email Address', value: user.email, key: 'email', icon: <Mail size={18} /> },
                { 
                  label: 'Current Education', 
                  value: user.education, 
                  key: 'education', 
                  icon: <GraduationCap size={18} />,
                  isDropdown: true,
                  options: [
                    "Under High School",
                    "High School",
                    "Undergraduate",
                    "Graduate"
                  ]
                },
                { 
                  label: 'Primary Interest', 
                  value: user.interest, 
                  key: 'interest', 
                  icon: <Briefcase size={18} />,
                  isDropdown: true,
                  options: [
                    "Technology & Software",
                    "Business & Entrepreneurship",
                    "Design & Creative Arts",
                    "Sports & Fitness",
                    "Science & Healthcare",
                    "Media & Communications",
                    "Education & Social Impact",
                    "Engineering & Hardware"
                  ]
                },
              ].map((field) => (
                <div key={field.key} className={`space-y-3 relative ${openDropdown === field.key ? 'z-50' : 'z-10'}`}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{field.label}</label>
                  
                  <div className="relative group">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-20 ${isEditing ? 'text-[#f5c842]' : 'text-gray-400'}`}>
                      {field.icon}
                    </span>
                    
                    {field.isDropdown && isEditing ? (
                      <div className="relative z-50">
                        {/* Custom Dropdown Trigger */}
                        <div 
                          onClick={() => setOpenDropdown(openDropdown === field.key ? null : field.key)}
                          className={`w-full bg-gray-50 border ${openDropdown === field.key ? 'border-[#f5c842] ring-1 ring-[#f5c842]' : 'border-gray-200'} rounded-[28px] py-4 pl-12 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all cursor-pointer flex justify-between items-center`}
                        >
                          <span className={!field.options.includes(field.value) ? "text-gray-400" : ""}>
                            {field.value}
                          </span>
                          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${openDropdown === field.key ? 'rotate-180 text-[#f5c842]' : ''}`} />
                        </div>

                        {/* Custom Dropdown Menu with Golden Design */}
                        {openDropdown === field.key && (
                          <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.08)] overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="max-h-[220px] overflow-y-auto">
                              {field.options.map((opt) => (
                                <div 
                                  key={opt}
                                  onClick={() => {
                                    setUser({...user, [field.key]: opt});
                                    setOpenDropdown(null);
                                  }}
                                  className={`px-6 py-3.5 text-sm font-bold cursor-pointer transition-all flex items-center gap-3
                                    ${field.value === opt 
                                      ? 'bg-[#f5c842]/10 text-gray-900 border-l-[3px] border-[#f5c842]' 
                                      : 'text-gray-500 border-l-[3px] border-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200'
                                    }`}
                                >
                                  {field.value === opt && <div className="w-1.5 h-1.5 rounded-full bg-[#f5c842]" />}
                                  <span className={field.value !== opt ? 'pl-[18px]' : ''}>{opt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        disabled={!isEditing || field.isDropdown}
                        value={field.value}
                        onChange={(e) => setUser({...user, [field.key]: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-[28px] py-4 pl-12 pr-4 text-sm font-semibold text-gray-900 focus:border-[#f5c842] focus:ring-1 focus:ring-[#f5c842] outline-none disabled:opacity-70 disabled:bg-gray-100 transition-all"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Career Tracks':
        return (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-xl font-black tracking-tight uppercase text-gray-900 mb-10">Active Roadmaps</h3>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-6 bg-white border border-gray-200 shadow-sm hover:border-[#f5c842] transition-colors rounded-[32px] group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#f5c842] rounded-2xl flex items-center justify-center text-black shadow-lg shadow-[#f5c842]/20">
                    <Target size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-widest uppercase text-gray-900">Frontend Developer</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">Primary Focus • 40% Complete</p>
                  </div>
                </div>
                <CheckCircle2 className="text-[#f5c842]" size={28} />
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200 hover:border-black transition-colors rounded-[32px] group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-widest uppercase text-gray-900">UI/UX Designer</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">Secondary Interest</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-black transition-colors" />
              </div>

            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${notificationsEnabled ? 'bg-green-100 text-green-500' : 'bg-[#f5c842]/10 text-[#f5c842]'}`}>
               <Bell size={32} className={notificationsEnabled ? '' : 'animate-bounce'} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4 text-gray-900">
              {notificationsEnabled ? 'Notifications Active' : 'Stay Notified'}
            </h3>
            <p className="max-w-xs text-gray-500 text-[10px] font-black tracking-widest uppercase leading-relaxed mb-10">
              {notificationsEnabled 
                ? 'You will receive your next daily update 24 hours from your last notification.' 
                : 'Receive daily alerts to keep your streak alive and track your career roadmap.'}
            </p>
            
            {notificationsEnabled ? (
               <button 
                onClick={disableNotification}
                className="px-10 py-4 bg-gray-100 text-gray-500 border border-gray-200 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                Disable Notifications
              </button>
            ) : (
              <button 
                onClick={requestNotification}
                className="px-10 py-4 bg-[#f5c842] text-black rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:scale-105 transition-transform shadow-lg shadow-[#f5c842]/20"
              >
                Enable 24Hr Alerts
              </button>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-[#f5c842]/10 flex items-center justify-center mb-6 text-[#f5c842]">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2 text-gray-900">Security</h3>
            <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase">Account Secured via JWT Auth</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-12 pb-24 px-4 sm:px-8 font-sans flex justify-center">
      <div className="w-full max-w-6xl">
        
        <header className="mb-12 relative bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
          
          <h1 className="text-gray-50 text-[100px] md:text-[140px] font-black leading-none absolute -bottom-8 right-4 select-none uppercase z-0 pointer-events-none">
            STRIDE
          </h1>

          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#f5c842] flex items-center justify-center text-black text-3xl md:text-5xl font-black shadow-xl shadow-[#f5c842]/30 shrink-0 z-10 border-4 border-white">
            {getInitials(user.name)}
          </div>
          
          <div className="text-center md:text-left z-10">
            <div className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
              <CheckCircle2 size={14} className="text-[#f5c842]" /> <span>{user.tier}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">{user.name}</h2>
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">ID: STD-ACC-{getInitials(user.name)}-2026</p>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-2 bg-[#f5c842] z-20"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-2">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsEditing(false); }}
                className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black tracking-[0.15em] uppercase transition-all flex items-center justify-between group cursor-pointer border-l-4 ${
                  activeTab === item.id 
                  ? 'bg-black text-white shadow-lg shadow-black/10 border-[#f5c842]' 
                  : 'bg-transparent text-gray-500 hover:bg-white border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={activeTab === item.id ? 'text-[#f5c842]' : 'text-gray-400 group-hover:text-black'}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                <ChevronRight size={14} className={`transition-transform ${activeTab === item.id ? 'translate-x-1 text-[#f5c842]' : 'opacity-0 group-hover:opacity-100 group-hover:text-black'}`} />
              </button>
            ))}
            
            <button 
              onClick={handleSignOut} 
              className="w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black tracking-[0.15em] uppercase bg-red-50 text-red-600 mt-8 hover:bg-red-600 hover:text-white transition-all flex items-center gap-4 cursor-pointer border-l-4 border-transparent"
            >
              <LogOut size={18} /> SIGN OUT
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm min-h-[500px]">
              {renderContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountPage;