import { LayoutDashboard, CheckSquare, FileText, Timer } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: false },
    { name: 'Tasks', icon: CheckSquare, active: false },
    { name: 'Notes', icon: FileText, active: true },
    { name: 'Timer', icon: Timer, active: false },
  ];

  return (
    <aside className="w-72 h-full bg-white text-text-primary flex flex-col p-8 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-100 flex-shrink-0 z-10 transition-all">
      <div className="mb-14 px-3 mt-4">
        <h1 className="text-5xl font-extrabold tracking-tighter text-text-primary mb-1 relative inline-block">
          Flo.
          <span className="absolute -top-1 -right-3 w-2.5 h-2.5 bg-primary rounded-full"></span>
        </h1>
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-2">Productivity Hub</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${item.active
                ? 'bg-primary text-text-primary shadow-[0_4px_12px_rgba(255,212,0,0.3)] font-bold scale-100'
                : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary hover:scale-[1.02]'
                }`}
            >
              <Icon size={22} strokeWidth={item.active ? 2.5 : 2} />
              <span className="text-base tracking-wide">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-2 pb-4">
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#FFB800] to-[#FF8C00] flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              W
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-text-primary leading-tight group-hover:text-secondary transition-colors">Wandi</p>
              <p className="text-[11px] text-text-secondary font-semibold mt-0.5">Free Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
