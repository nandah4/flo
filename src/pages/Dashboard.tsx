import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Download, Calendar, Flame, Zap,
    CheckCircle2, Clock, FileText, AlertCircle,
    ArrowRight, Flag, Lock,
    ChevronRight, Loader, SquareStack, Info, X,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DashboardLayout from '../ui/DashboardLayout';
import { useQuest } from '../context/QuestContext';
import FloatingAIButton from '../components/common/FloatingAIButton';
import AIChatPanel from '../components/common/AIChatPanel';

// Character images
import beginnerImg from '../assets/images/begginer.png';
import learnerImg from '../assets/images/learners.png';
import explorerImg from '../assets/images/explorers.png';

// Level config
interface Level {
    level: number;
    title: string;
    subtitle: string;
    minXp: number;
    maxXp: number;
    img: string;
}

const LEVELS: Level[] = [
    { level: 1, title: 'Beginner', subtitle: 'Just Getting Started', minXp: 0, maxXp: 499, img: beginnerImg },
    { level: 2, title: 'Learner', subtitle: 'Building Momentum', minXp: 500, maxXp: 1499, img: learnerImg },
    { level: 3, title: 'Explorer', subtitle: 'Forging Ahead', minXp: 1500, maxXp: 2499, img: explorerImg },
];

function getLevelInfo(xp: number) {
    const lvl = LEVELS.slice().reverse().find(l => xp >= l.minXp) ?? LEVELS[0];
    const next = LEVELS.find(l => l.level === lvl.level + 1);
    return { ...lvl, next };
}

import { getDashboardStats, getRecentTasks, initialColumns } from '../data/mockTasks';
import { initialNotes } from '../data/mockNotes';

// Get recent tasks dynamically
const RECENT_TASKS = getRecentTasks(initialColumns);

const STATUS_STYLE: Record<string, string> = {
    'Done': 'bg-green-50 text-green-700 border border-green-200',
    'In Progress': 'bg-blue-50 text-blue-700 border border-blue-200',
    'In Review': 'bg-orange-50 text-secondary border border-secondary/25',
    'Overdue': 'bg-red-50 text-red-600 border border-red-200',
    'Pending': 'bg-gray-100 text-text-secondary border border-gray-200',
};

const PRIORITY_STYLE: Record<string, string> = {
    High: 'bg-red-50 text-red-600',
    Medium: 'bg-orange-50 text-secondary',
    Low: 'bg-gray-100 text-text-secondary',
};

import { initialEvents } from '../data/mockEvents';

// Main component
const Dashboard = () => {
    const { xp } = useQuest();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [xpInfoOpen, setXpInfoOpen] = useState(false);

    const lvl = getLevelInfo(xp);
    const streak = 5;

    // Stats dynamically computed from initialColumns
    const taskStats = getDashboardStats(initialColumns);
    const stats = {
        completed: taskStats.completed,
        inProgress: taskStats.inProgress,
        inReview: taskStats.inReview,
        overdue: taskStats.overdue,
        pomodoroHrs: 8.5,
        totalNotes: initialNotes.length,
        totalEvents: initialEvents.length,
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-10">

                {/* HEADER */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Left: Title + description */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">
                                Dashboard
                            </h2>
                            <p className="text-sm text-text-secondary mt-0.5">
                                Track your progress, tasks and learning journey
                            </p>
                        </div>

                        {/* Right: Date + Export */}
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 border border-gray-200 ">
                                <Calendar size={16} className="text-text-primary" />
                                <h3 className="text-sm font-normal text-text-primary whitespace-nowrap truncate min-w-0">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                            </div>
                            <button className="flex items-center gap-2 bg-linear-to-t from-primary to-primary/75 hover:opacity-90 text-text-primary px-4 py-2.5 text-sm font-medium cursor-pointer border-none hover:scale-105 transition-all duration-300 rounded-lg">
                                <Download size={15} />
                                Export Data
                            </button>
                        </div>
                    </div>
                </header>


                <div className="px-4 md:pr-10 md:pl-0 space-y-4">

                    {/* LEVEL CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                            <img
                                src={lvl.img}
                                alt={lvl.title}
                                className="w-16 h-16 object-cover"
                            />




                            {/* Stats pills */}
                            <div>
                                <p className="text-base text-text-primary font-normal mb-1">Your Profile Stats</p>

                                <div className="flex flex-wrap gap-2 items-center">

                                    {[
                                        { label: 'Level', value: `Lv. ${lvl.level}`, icon: null, dark: true },
                                        { label: 'Rank', value: lvl.title, icon: null, dark: false },
                                        { label: 'XP', value: `${xp} XP`, icon: <Zap size={12} className="text-primary fill-primary" />, dark: false },
                                    ].map((pill) => (
                                        <div
                                            key={pill.label}
                                            className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-sm font-normal
                                            ${pill.dark
                                                    ? 'bg-secondary text-white border-transparent'
                                                    : ' text-text-primary'}`}
                                        >
                                            {pill.icon}
                                            <span className={pill.dark ? 'text-white text-xs' : 'text-text-secondary text-xs'}>{pill.label}</span>
                                            <span className="font-medium text-[13px]">{pill.value}</span>
                                        </div>
                                    ))}

                                    {/* Streak pill */}
                                    <div className="relative group">
                                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded text-sm font-normal text-text-primary cursor-default">
                                            <Flame size={12} className="text-red-500 fill-red-500" />
                                            <span className="text-text-secondary text-xs">Streak</span>
                                            <span className="font-medium text-[13px]">{streak} Days</span>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 pointer-events-none
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                                            <div className="bg-text-primary text-white rounded-xl px-3.5 py-3 shadow-lg">
                                                <p className="text-xs font-medium mb-1 flex items-center gap-1.5">
                                                    <Flame size={11} className="text-red-400 fill-red-400 shrink-0" />
                                                    How to maintain your streak
                                                </p>
                                                <p className="text-[11px] text-white/70 leading-relaxed">
                                                    Complete at least one activity in Flo every day — write a note, finish a task, or run a focus session — to keep your streak alive.
                                                </p>
                                            </div>
                                            {/* Arrow */}
                                            <div className="w-2.5 h-2.5 bg-text-primary rotate-45 mx-auto -mt-1.5 rounded-sm" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'Completed Tasks', value: stats.completed, icon: <CheckCircle2 size={18} className='fill-secondary text-white' />, description: 'Tasks you’ve successfully finished.' },
                            { label: 'In Progress', value: stats.inProgress, icon: <Loader size={18} className='fill-secondary text-secondary' />, description: 'Tasks you’re currently working on.' },
                            { label: 'Under Review', value: stats.inReview, icon: <SquareStack size={18} className='fill-secondary text-white' />, description: 'Tasks waiting for feedback or approval.' },
                            { label: 'Overdue Tasks', value: stats.overdue, icon: <AlertCircle size={18} className='fill-secondary text-white' />, description: 'Tasks that passed their deadline.' },
                            { label: 'Focus Hours', value: `${stats.pomodoroHrs}h`, icon: <Clock size={18} className='text-secondary' />, description: 'Total hours spent in deep focus.' },
                            { label: 'Total Notes', value: stats.totalNotes, icon: <FileText size={18} className='fill-secondary text-white' />, description: 'All notes you’ve created so far.' },
                            { label: 'Total Events', value: stats.totalEvents, icon: <Calendar size={18} className='fill-secondary text-white' />, description: 'Events you’ve added to your calendar.' },
                        ].map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 + i * 0.04 }}
                                className={`flex flex-col gap-5 p-4 rounded-xl border hover:bg-primary/10 transition-all duration-300 bg-white border-gray-200`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-normal text-text-primary">{s.label}</span>
                                    <span>{s.icon}</span>
                                </div>
                                <span className={`text-4xl font-medium `}>{s.value}</span>
                                <span className="text-xs text-text-secondary font-normal">{s.description}</span>
                            </motion.div>
                        ))}
                    </div>


                    {/* BOTTOM GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Recent Tasks */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18 }}
                            className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-medium text-text-primary">Recent Tasks</h3>
                                    <p className="text-sm text-text-secondary mt-0.5">Your latest task activity</p>
                                </div>
                                <Link
                                    to="/tasks"
                                    className="flex items-center gap-1.5 text-sm font-normal text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    View All <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div className="space-y-2">
                                {RECENT_TASKS.map((task, i) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.22 + i * 0.04 }}
                                        className="flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-bg-app transition-all group cursor-pointer"
                                    >
                                        {/* Title */}
                                        <p className="flex-1 text-sm font-normal text-text-primary line-clamp-1 leading-snug">
                                            {task.title}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs font-normal px-2.5 py-1 rounded-md ${STATUS_STYLE[task.status]}`}>
                                                {task.status}
                                            </span>
                                            <span className={`hidden sm:inline  text-xs font-normal px-2.5 py-1 rounded-md ${task.priority ? PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.Low : PRIORITY_STYLE.Low}`}>
                                                <Flag size={8} className="inline mr-1" />
                                                {task.priority || "Low"}
                                            </span>
                                            <span className="hidden md:flex items-center gap-1 text-xs text-text-secondary font-normal">
                                                <Calendar size={13} />
                                                {task.date}
                                            </span>
                                        </div>

                                        <ChevronRight size={13} className="text-gray-200 group-hover:text-gray-400 transition-colors shrink-0" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ─ Level Roadmap (1/3) ─ */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22 }}
                            className="bg-white rounded-lg border border-gray-200 p-5"
                        >
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-text-primary">Level Roadmap</h3>
                                        <p className="text-sm text-text-secondary mt-0.5">XP required per level</p>
                                    </div>
                                    <button
                                        onClick={() => setXpInfoOpen(o => !o)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-app transition-colors shrink-0"
                                    >
                                        {xpInfoOpen ? <X size={15} /> : <Info size={15} />}
                                    </button>
                                </div>

                                {/* XP tip popup */}
                                <AnimatePresence>
                                    {xpInfoOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -6, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-text-primary mb-1">
                                                    How to Earn XP
                                                </p>
                                                <p className="text-xs text-text-secondary leading-relaxed">
                                                    Complete any activity in Flow — write a note, create a task, or start a focus session —
                                                    and earn <span className="font-medium text-text-primary">10 XP per activity each day</span>.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-1.5">
                                {LEVELS.map((l) => {
                                    const reached = xp >= l.minXp;
                                    const current = lvl.level === l.level;

                                    return (
                                        <div
                                            key={l.level}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                                                ${current ? 'bg-primary/10 border border-primary/20' : ''}`}
                                        >
                                            {/* Character thumbnail */}
                                            <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden
                                                ${reached ? ' bg-primary/5' : 'border-gray-100 bg-gray-50 grayscale opacity-40'}`}
                                            >
                                                <img src={l.img} alt={l.title} className="w-full h-full object-contain p-0.5" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className={`text-sm font-normal truncate
                                                        ${current ? 'text-text-primary font-medium' : reached ? 'text-text-primary' : 'text-text-secondary'}`}
                                                    >
                                                        Lv.{l.level} — {l.title}
                                                    </p>
                                                    {current && (
                                                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-text-primary text-white shrink-0">
                                                            YOU
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-text-secondary mt-0.5">
                                                    {l.minXp} – {l.maxXp === 9999 ? '∞' : l.maxXp} XP
                                                </p>
                                            </div>

                                            {/* State icon */}
                                            {reached && !current
                                                ? <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                                                : !reached
                                                    ? <Lock size={12} className="text-text-secondary shrink-0" />
                                                    : null
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            <FloatingAIButton onClick={() => setIsChatOpen(true)} />
            <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </DashboardLayout>
    );
};

export default Dashboard;
