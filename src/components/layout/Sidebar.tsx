"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Timer,
  Zap,
  Layers,
  Settings,
  HelpCircle,
  Plus,
  ChevronsDownUp,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  shortcut?: string;
  badge?: boolean;
}

interface Project {
  color: string;
  label: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  { icon: <Search size={18} />, label: "Search", path: "/search" },
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
  { icon: <FileText size={18} />, label: "Notes", badge: true, path: "/notes" },
  { icon: <CheckSquare size={18} />, label: "Tasks", path: "/tasks" },
  { icon: <Timer size={18} />, label: "Timer", path: "/timer" },
  { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
];

const sharedItems: NavItem[] = [
  { icon: <Zap size={16} />, label: "Boosts", path: "#" },
  { icon: <Layers size={16} />, label: "Documents", path: "#" },
];

const projects: Project[] = [
  { color: "#4ade80", label: "Personal" },
  { color: "#a78bfa", label: "Business" },
  { color: "#c084fc", label: "Travel" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function NavRow({
  item,
  collapsed,
  isActive
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  return (
    <Link to={item.path} className="block w-full">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center hover:bg-bg-app gap-3 px-2.5 py-2 rounded-lg text-left transition-colors relative group ${isActive ? "bg-bg-app border border-gray-200" : ""
          }`}
      >
        <span className={`relative shrink-0 ${isActive ? "text-primary" : "text-gray-500"}`}>
          {item.icon}
          {/* {item.badge && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
          )} */}
        </span>

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex-1 text-sm whitespace-nowrap overflow-hidden ${isActive ? "text-text-primary font-medium" : "text-text-secondary"}`}
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
    </Link>
  );
}

// ─── Main Component 
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <div className="flex h-screen bg-bg-app p-6 font-sans">
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col overflow-hidden shrink-0"
        style={{ width: sidebarWidth }}
      >
        {/* ── Toggle button ── */}
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!collapsed && <ChevronsDownUp size={14} />}
        </button>

        {/* ── Workspace header ── */}
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3 min-w-0">

            <AnimatePresence>
              {collapsed ? (
                <div className="flex flex-col items-center justify-center gap-y-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <span className="text-text-primary text-xs font-bold">FL</span>
                  </div>
                  <button
                    onClick={() => setCollapsed((p) => !p)}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    <ChevronsDownUp size={14} />
                  </button>
                </div>

              ) : (
                <h2 className="text-2xl font-medium text-text-primary">Flo.</h2>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 space-y-2">

          {/* Nav items */}
          {navItems.map((item) => (
            <NavRow key={item.label} item={item} collapsed={collapsed} isActive={location.pathname === item.path} />
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-gray-100" />

          {/* Shared section */}
          {/* <div className="flex items-center justify-between px-2.5 mb-1">
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-gray-400 font-medium"
                >
                  Shared
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Plus size={14} />
              </button>
            )}
          </div> */}

          {/* {sharedItems.map((item) => (
            <NavRow key={item.label} item={item} collapsed={collapsed} />
          ))} */}

          {/* Divider */}
          {/* <div className="my-3 border-t border-gray-100" /> */}

          {/* Projects section */}
          {/* <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-xs text-gray-400 font-medium px-2.5 mb-1">Projects</p>
                {projects.map((p) => (
                  <motion.button
                    key={p.label}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg"
                  >
                    <span
                      className="w-5 h-5 rounded-md shrink-0"
                      style={{ backgroundColor: p.color, opacity: 0.7 }}
                    />
                    <span className="text-sm text-gray-700">{p.label}</span>
                  </motion.button>
                ))}


                <motion.button
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg"
                >
                  <span className="w-5 h-5 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                    <Plus size={10} className="text-gray-400" />
                  </span>
                  <span className="text-sm text-gray-400">Add New Project</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>

        {/* ── Footer ── */}
        {/* <div className="border-t border-gray-100 px-3 py-2 space-y-1">
          {[
            { icon: <Settings size={16} />, label: "Settings" },
            { icon: <HelpCircle size={16} />, label: "Help" },
          ].map((item) => (
            <NavRow key={item.label} item={item} collapsed={collapsed} />
          ))}
        </div> */}

        {/* ── User profile ── */}
        <div className="border-t border-gray-100 px-3 py-3">
          <motion.button
            whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
            className="w-full flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-amber-200">
              <div className="w-full h-full flex items-center justify-center text-amber-700 text-sm font-bold">S</div>
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
            {!collapsed && <ChevronDown size={14} className="text-gray-400 shrink-0" />}
          </motion.button>
        </div>
      </motion.aside>
    </div>
  );
}