"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import floLogo from "../../assets/images/flo-logo.png";
import {
  Search,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Timer,
  Settings,
  ChevronsDownUp,
  ChevronDown,
  Activity,
} from "lucide-react";

// Types
interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: boolean;
}

// Data
const navItems: NavItem[] = [
  { icon: <Search size={18} />, label: "Search", path: "/search" },
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
  { icon: <FileText size={18} />, label: "Notes", badge: true, path: "/notes" },
  { icon: <CheckSquare size={18} />, label: "Tasks", path: "/tasks" },
  { icon: <Activity size={18} />, label: "Planning", path: "/planning" },
  { icon: <Timer size={18} />, label: "Focus Timer", path: "/timer" },
];

// Sidebar nav row (desktop)
function NavRow({
  item,
  collapsed,
  isActive,
  onSearchOpen,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onSearchOpen?: () => void;
}) {
  const inner = (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center hover:bg-bg-app gap-3 px-2.5 py-2.5 rounded-lg text-left transition-colors relative group ${isActive ? "bg-bg-app border border-gray-100" : ""
        }`}
    >
      <span className={`relative shrink-0 ${isActive ? "text-secondary" : "text-text-secondary"}`}>
        {item.icon}
      </span>

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-1 text-sm whitespace-nowrap overflow-hidden ${isActive ? "text-text-primary font-medium" : "text-text-secondary"
              }`}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
          {item.label}
        </span>
      )}
    </motion.div>
  );

  if (item.label === "Search") {
    return (
      <button className="block w-full" onClick={onSearchOpen}>
        {inner}
      </button>
    );
  }

  return (
    <Link to={item.path} className="block w-full">
      {inner}
    </Link>
  );
}

// Bottom appbar item (mobile)
function BottomNavItem({
  item,
  isActive,
  onSearchOpen,
}: {
  item: NavItem;
  isActive: boolean;
  onSearchOpen?: () => void;
}) {
  const inner = (
    <motion.div
      whileTap={{ scale: 0.94 }}
      className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-colors"
    >
      <span className={`${isActive ? "text-secondary" : "text-text-secondary"}`}>
        {item.icon}
      </span>
      <span
        className={`text-[10px] font-medium whitespace-nowrap ${isActive ? "text-secondary" : "text-text-secondary"
          }`}
      >
        {item.label}
      </span>
    </motion.div>
  );

  if (item.label === "Search") {
    return (
      <button onClick={onSearchOpen} className="shrink-0">
        {inner}
      </button>
    );
  }

  return (
    <Link to={item.path} className="shrink-0">
      {inner}
    </Link>
  );
}

// Main Component
export default function Sidebar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <>
      {/* Desktop sidebar (sm and up) */}
      <div className="hidden sm:flex h-screen bg-bg-app p-6 font-sans shrink-0">
        <motion.aside
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col overflow-hidden"
          style={{ width: sidebarWidth }}
        >
          {/* Toggle button */}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!collapsed && <ChevronsDownUp size={14} />}
          </button>

          {/* Workspace header */}
          <div className="p-4 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <AnimatePresence>
                {collapsed ? (
                  <div className="flex flex-col items-center justify-center gap-y-3">
                    <img src={floLogo} alt="Flo" className="w-8 h-8 object-contain" />
                    <button
                      onClick={() => setCollapsed((p) => !p)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronsDownUp size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <img src={floLogo} alt="Flo" className="h-8 object-contain" />
                    <h2 className="text-2xl font-medium text-text-primary">Flo.</h2>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Scrollable nav */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 space-y-2">
            {navItems.map((item) => (
              <NavRow
                key={item.label}
                item={item}
                collapsed={collapsed}
                isActive={location.pathname === item.path}
                onSearchOpen={item.label === "Search" ? onSearchOpen : undefined}
              />
            ))}

            <div className="my-3 border-t border-gray-100" />

            {/* Notespace section */}
            {!collapsed && (
              <>
                <p className="px-2.5 mb-1 text-sm font-medium text-text-primary select-none">
                  Notespace
                </p>
              </>
            )}

            {[
              { name: "Lectures", color: "#3A9AFF", count: 12 },
              { name: "Personal", color: "#10b981", count: 5 },
              { name: "Projects", color: "#FF8C00", count: 8 },
            ].map((ns) => (
              <Link
                key={ns.name}
                to="/notes"
                className="group w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-bg-app transition-colors"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ns.color }}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex items-center justify-between overflow-hidden"
                    >
                      <span className="text-sm text-text-secondary whitespace-nowrap">{ns.name}</span>
                      <span className="text-[11px] text-gray-400 shrink-0">{ns.count}</span>
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    {ns.name}
                  </span>
                )}
              </Link>
            ))}

          </div>

          {/* User profile */}
          <div className={`border-t border-gray-100 py-3 ${collapsed ? "px-2" : "px-3"}`}>
            <motion.button
              whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
              className="w-full flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-primary/65">
                <div className="w-full h-full flex items-center justify-center text-secondary text-sm font-bold">S</div>
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium text-gray-800 whitespace-nowrap">Wandi Der</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">wandider@gmail.com</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && <ChevronDown size={14} className="text-text-secondary shrink-0" />}
            </motion.button>
          </div>
        </motion.aside>
      </div>

      {/* ── Mobile bottom appbar (< 640px) ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 font-sans">
        <nav className="bg-white border border-gray-200 rounded-2xl shadow-lg shadow-black/10 overflow-x-auto flex items-center gap-1 px-2 py-1"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <img src={floLogo} alt="Flo" className="w-7 h-7 object-contain" />
          </div>
          {navItems.map((item) => (
            <BottomNavItem
              key={item.label}
              item={item}
              isActive={location.pathname === item.path}
              onSearchOpen={item.label === "Search" ? onSearchOpen : undefined}
            />
          ))}
          <motion.button
            whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
            className="w-full flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-primary/65">
              <div className="w-full h-full flex items-center justify-center text-secondary text-sm font-bold">S</div>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 text-left overflow-hidden"
                >
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>
    </>
  );
}