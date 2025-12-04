// FamilyKnows-Website/src/components/familyknows/AppScreenMockups.tsx
// CSS-only recreations of the Award-Winning App UI
import React from 'react';

// --- SCREEN 1: FLUID DASHBOARD ---
export const DashboardMockup = () => (
  <div className="w-full h-full bg-slate-900 relative overflow-hidden flex flex-col">
    {/* Status Bar */}
    <div className="h-6 w-full flex justify-between px-4 items-center mt-2">
      <div className="text-[10px] text-white font-bold">9:41</div>
      <div className="flex gap-1">
        <div className="w-3 h-3 rounded-full border border-white"></div>
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
    </div>

    {/* Dashboard Layer (Receded - showing Fluid Morph effect) */}
    <div className="flex-1 mx-2 mt-2 bg-slate-100 rounded-t-2xl p-4 scale-95 opacity-80 origin-bottom transform transition-all duration-500">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-xs text-slate-500">Good Morning,</div>
          <div className="text-lg font-bold text-slate-800">Kamal</div>
        </div>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">👤</div>
      </div>

      {/* Live Status Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: '⚡', bg: 'bg-amber-100', text: 'Critical', badge: '2 Due', badgeColor: 'bg-amber-500', color: 'text-amber-600' },
          { icon: '🏥', bg: 'bg-red-100', text: 'Health', badge: '1 Alert', badgeColor: 'bg-red-500', color: 'text-red-600' },
          { icon: '🏠', bg: 'bg-blue-100', text: 'Assets', badge: null, badgeColor: '', color: 'text-blue-600' },
          { icon: '📄', bg: 'bg-purple-100', text: 'Docs', badge: '+12%', badgeColor: 'bg-emerald-500', color: 'text-purple-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-3 rounded-xl shadow-sm relative">
            <div className="flex justify-between items-start">
              <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center`}>{item.icon}</div>
              {item.badge && (
                <div className={`${item.badgeColor} px-1.5 py-0.5 rounded text-[8px] text-white font-bold`}>
                  {item.badge}
                </div>
              )}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-2">{item.text}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Chat Layer (Active - Glass Command Center) */}
    <div className="absolute top-20 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-4 flex flex-col">
      {/* Handle Bar */}
      <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4"></div>

      {/* Chat Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800">Hi Kamal</div>
          <div className="text-[10px] text-slate-500">How can I help you today?</div>
        </div>
      </div>

      {/* Chat Bubbles */}
      <div className="space-y-3 flex-1 overflow-hidden">
        <div className="bg-slate-100 self-start rounded-2xl rounded-tl-none p-3 max-w-[80%] text-xs text-slate-700 shadow-sm">
          Hi Kamal! Your inverter AMC expires in 2 days.
        </div>
        <div className="bg-blue-600 self-end rounded-2xl rounded-tr-none p-3 max-w-[80%] text-xs text-white shadow-md ml-auto">
          Show me the details.
        </div>
        {/* Widget Mockup - Asset Card */}
        <div className="bg-slate-900 rounded-xl p-3 border border-blue-500/30 w-3/4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-[10px] text-blue-200 uppercase tracking-wider">Active Contract</div>
          </div>
          <div className="text-white text-xs font-bold">Luminous Care Plan</div>
          <div className="text-[10px] text-slate-400">Valid until Dec 2025</div>
        </div>
      </div>

      {/* Floating Input Pill */}
      <div className="mt-4 h-10 bg-white border border-slate-200 rounded-full shadow-lg flex items-center px-4 justify-between">
        <span className="text-slate-400 text-xs">Ask FamilyKnows...</span>
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px]">↑</div>
      </div>
    </div>
  </div>
);

// --- SCREEN 2: ORBIT NETWORK (Circle of Trust) ---
export const OrbitMockup = () => (
  <div className="w-full h-full bg-[#0F172A] relative overflow-hidden flex items-center justify-center">
    {/* Background Grid */}
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }}></div>

    {/* Holographic Scanlines */}
    <div className="absolute inset-0 pointer-events-none opacity-10">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute left-0 right-0 h-px bg-blue-400" style={{ top: `${i * 7}%` }}></div>
      ))}
    </div>

    {/* Orbit Rings */}
    <div className="absolute w-48 h-48 border border-blue-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
    <div className="absolute w-36 h-36 border border-blue-500/30 rounded-full border-dashed"></div>
    <div className="absolute w-24 h-24 border border-blue-500/40 rounded-full"></div>

    {/* Connection Lines */}
    <svg className="absolute w-48 h-48" viewBox="0 0 200 200">
      <line x1="100" y1="100" x2="100" y2="25" stroke="#10B981" strokeWidth="1" opacity="0.4" />
      <line x1="100" y1="100" x2="175" y2="100" stroke="#3B82F6" strokeWidth="1" opacity="0.4" />
      <line x1="100" y1="100" x2="50" y2="150" stroke="#F59E0B" strokeWidth="1" opacity="0.4" />
    </svg>

    {/* Center User */}
    <div className="relative z-10 w-14 h-14 rounded-full border-2 border-white shadow-[0_0_30px_rgba(59,130,246,0.5)] overflow-hidden bg-slate-800 flex items-center justify-center">
      <span className="text-2xl">👨‍💼</span>
      {/* Pulse Glow */}
      <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
    </div>

    {/* Orbiting Nodes (Floating Planets) */}
    <div className="absolute w-48 h-48 animate-[spin_25s_linear_infinite]">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg flex items-center justify-center text-sm">
        👨‍⚕️
        <div className="absolute -bottom-4 text-[8px] text-emerald-300 whitespace-nowrap">Dr. Rao</div>
      </div>
    </div>
    <div className="absolute w-48 h-48 animate-[spin_18s_linear_infinite_reverse]">
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full border-2 border-slate-900 shadow-lg flex items-center justify-center text-sm">
        ⚖️
      </div>
    </div>
    <div className="absolute w-36 h-36 animate-[spin_12s_linear_infinite]">
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-500 rounded-full border-2 border-slate-900 shadow-lg flex items-center justify-center text-xs">
        💼
      </div>
    </div>

    {/* Badge */}
    <div className="absolute top-4 left-4 bg-blue-600 px-2 py-1 rounded-lg flex items-center gap-1">
      <span className="text-xs">🔗</span>
      <span className="text-[10px] text-white font-bold">3</span>
    </div>

    {/* Bottom Sheet Hint */}
    <div className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-sm p-4 rounded-t-2xl border-t border-blue-500/20">
      <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-3"></div>
      <div className="text-white text-sm font-bold text-center">Your Trusted Network</div>
      <div className="text-slate-400 text-[10px] text-center mt-1">3 Family • 2 Providers</div>
      <div className="flex items-center justify-center gap-1 mt-2">
        <span className="text-[10px] text-blue-400">Tap to expand</span>
        <span className="text-blue-400 text-[10px]">↗</span>
      </div>
    </div>

    {/* Corner Decorations */}
    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500/50 rounded-tl"></div>
    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500/50 rounded-tr"></div>
  </div>
);

// --- SCREEN 3: STORY ONBOARDING (The Tree) ---
export const StoryMockup = () => (
  <div className="w-full h-full bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] relative flex flex-col items-center overflow-hidden">
    {/* Stars Background */}
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            animationDelay: `${Math.random() * 2}s`,
          }}
        ></div>
      ))}
    </div>

    {/* Header */}
    <div className="mt-12 text-center z-10">
      <div className="text-white text-xl font-bold mb-1 opacity-90">FamilyKnows</div>
      <div className="text-emerald-400 text-[10px] uppercase tracking-[0.2em]">Build Your Legacy</div>
    </div>

    {/* The Growing Tree */}
    <div className="relative flex-1 w-full flex flex-col items-center justify-center">
      {/* Tree Trunk */}
      <div className="absolute bottom-16 w-2 h-36 bg-gradient-to-t from-purple-700 to-purple-500 rounded-full shadow-lg"></div>

      {/* Main Branch Left */}
      <div className="absolute bottom-32 left-1/2 -translate-x-full w-12 h-1.5 bg-purple-500 origin-right -rotate-45 rounded-full"></div>

      {/* Main Branch Right */}
      <div className="absolute bottom-32 left-1/2 w-12 h-1.5 bg-purple-500 origin-left rotate-45 rounded-full"></div>

      {/* Root Node (You) */}
      <div className="absolute bottom-[10rem] z-20">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] border-2 border-white text-2xl animate-bounce">
            👤
          </div>
          <div className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-[9px] text-white border border-white/20">
            You (Admin)
          </div>
        </div>
      </div>

      {/* Family Node (Left) */}
      <div className="absolute bottom-[8.5rem] left-[20%] z-10 animate-pulse">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 text-lg">
          👪
        </div>
        <div className="text-[8px] text-blue-300 text-center mt-1">Family</div>
      </div>

      {/* Assets Node (Right) */}
      <div className="absolute bottom-[8.5rem] right-[20%] z-10 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 text-lg">
          🏠
        </div>
        <div className="text-[8px] text-amber-300 text-center mt-1">Assets</div>
      </div>

      {/* Ground Gradient */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>

    {/* Floating Input Card */}
    <div className="absolute bottom-6 left-4 right-4 bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl z-20">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-medium">Step 1 of 3</div>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
        </div>
      </div>
      <div className="text-white text-sm font-semibold mb-3">Name your family tree</div>
      <div className="w-full h-8 bg-slate-700/50 rounded-lg border border-slate-600 flex items-center px-3">
        <span className="text-slate-400 text-xs">The Charan Family</span>
        <span className="ml-auto text-emerald-400 animate-pulse">|</span>
      </div>
      <div className="mt-3 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
      </div>
    </div>
  </div>
);
