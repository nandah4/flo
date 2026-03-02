import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Zap, Star, Trophy, CheckCircle2, Shield,
    FileText, CheckSquare, Timer, Sparkles, Layers,
    Calendar, Flag, ArrowRight, Flame, TrendingUp,
    Lock, Swords, BookOpen, Target,
} from 'lucide-react';
import DashboardLayout from '../ui/DashboardLayout';
import { useQuest, type QuestId } from '../context/QuestContext';
import FloatingAIButton from '../components/common/FloatingAIButton';
import AIChatPanel from '../components/common/AIChatPanel';

// ─── XP / Level config ───────────────────────────────────────────────────────
interface Level {
    level: number;
    title: string;
    subtitle: string;
    minXp: number;
    maxXp: number;
    gradient: string;
    badge: string;
    icon: React.ReactNode;
}

const LEVELS: Level[] = [
    { level: 1, title: 'Beginner', subtitle: 'Just Getting Started', minXp: 0, maxXp: 199, gradient: '', badge: 'bg-white/50 text-gray-900', icon: <BookOpen size={20} /> },
    { level: 2, title: 'Learner', subtitle: 'Building Momentum', minXp: 200, maxXp: 499, gradient: '', badge: 'bg-white/50 text-gray-900', icon: <Target size={20} /> },
    { level: 3, title: 'Explorer', subtitle: 'Forging Ahead', minXp: 500, maxXp: 999, gradient: '', badge: 'bg-white/50 text-gray-900', icon: <Swords size={20} /> },
    { level: 4, title: 'Scholar', subtitle: 'Knowledge Seeker', minXp: 1000, maxXp: 1999, gradient: '', badge: 'bg-white/50 text-gray-900', icon: <Shield size={20} /> },
    { level: 5, title: 'Master', subtitle: 'Ultimate Productivity', minXp: 2000, maxXp: 9999, gradient: '', badge: 'bg-white/50 text-gray-900', icon: <Trophy size={20} /> },
];

function getLevelInfo(xp: number) {
    const lvl = LEVELS.slice().reverse().find(l => xp >= l.minXp) ?? LEVELS[0];
    const next = LEVELS.find(l => l.level === lvl.level + 1);
    const range = lvl.maxXp - lvl.minXp;
    const progress = Math.min(((xp - lvl.minXp) / range) * 100, 100);
    return { ...lvl, next, progress };
}

// ─── Achievement badges ───────────────────────────────────────────────────────
const ACHIEVEMENTS = [
    { id: 'first_note', label: 'First Note', icon: '📝', unlocked: true },
    { id: 'streak3', label: '3-Day Streak', icon: '🔥', unlocked: true },
    { id: 'flashmaster', label: 'Flashcard Fan', icon: '⚡', unlocked: false },
    { id: 'taskslayer', label: 'Task Slayer', icon: '⚔️', unlocked: false },
    { id: 'scholar', label: 'Scholar', icon: '🎓', unlocked: false },
];

// ─── Quest metadata ───────────────────────────────────────────────────────────
const QUEST_META: Record<QuestId, { icon: React.ReactNode; link?: string; difficulty: 'Easy' | 'Medium' | 'Hard' }> = {
    note: { icon: <FileText size={16} />, link: '/notes', difficulty: 'Easy' },
    task: { icon: <CheckSquare size={16} />, link: '/tasks', difficulty: 'Medium' },
    ai: { icon: <Sparkles size={16} />, link: '/notes', difficulty: 'Easy' },
    flashcard: { icon: <Layers size={16} />, link: '/notes', difficulty: 'Medium' },
    pomodoro: { icon: <Timer size={16} />, difficulty: 'Hard' },
};

const DIFF_STYLE = {
    Easy: 'bg-primary/10 text-gray-700',
    Medium: 'bg-secondary/10 text-secondary',
    Hard: 'bg-red-50 text-red-600',
};

// ─── Upcoming tasks ───────────────────────────────────────────────────────────
const UPCOMING = [
    { id: 't1', title: 'Write your goal. Flow will break it down for you.', date: '02/24', time: '12:11 PM', priority: 'High' as const, column: 'To Do' },
    { id: 'p1', title: 'Write your goal. Flow will break it down for you.', date: '01/24', time: '14:11 PM', priority: 'Medium' as const, column: 'In Progress' },
];

const PRIORITY_STYLE: Record<string, string> = {
    High: 'bg-red-50 text-red-600',
    Medium: 'bg-secondary/10 text-secondary',
    Low: 'bg-primary/20 text-gray-800',
};

function formatDate(dateStr: string) {
    const [month, day] = dateStr.split('/');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
const Dashboard = () => {
    const { xp, quests, lastXpGain } = useQuest();
    const [greeting, setGreeting] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const h = new Date().getHours();
        if (h < 12) setGreeting('Good morning');
        else if (h < 17) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    const lvl = getLevelInfo(xp);
    const completedQuests = quests.filter(q => q.done).length;
    const totalQuestXp = quests.reduce((s, q) => s + (q.done ? q.xpReward : 0), 0);
    const streak = 5;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-10">

                {/* Greeting header */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-0.5">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">
                                {greeting}, Wandi 👋
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
                                <Flame size={14} className="text-secondary" />
                                <span className="text-xs font-bold text-secondary">{streak} Day Streak</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="px-4 md:pr-10 md:pl-0 space-y-5">

                    {/* ── Hero XP Banner ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-primary/20 bg-white shadow-sm border border-primary/20`}>

                        {/* Background decoration (Orange circles) */}
                        <div className="absolute inset-0 opacity-40 pointer-events-none">
                            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary blur-3xl opacity-50" />
                            <div className="absolute -bottom-20 -left-12 w-64 h-64 rounded-full bg-primary blur-3xl opacity-50" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-400 blur-[80px] opacity-20" />
                        </div>

                        <div className={`relative flex flex-col sm:flex-row sm:items-center gap-5 text-gray-900 p-6`}>
                            {/* Level avatar */}
                            <div className="relative shrink-0">
                                <div className={`w-20 h-20 rounded-[1.25rem] flex items-center justify-center shadow-sm bg-white/80 backdrop-blur-md border border-white relative z-10`}>
                                    <span className="text-4xl drop-shadow-sm">{lvl.level === 1 ? '🌱' : lvl.level === 2 ? '📘' : lvl.level === 3 ? '⚔️' : lvl.level === 4 ? '🎓' : '👑'}</span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shadow-md border-2 border-white z-20">
                                    <span className="text-xs font-black">{lvl.level}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="opacity-80 text-[11px] font-bold uppercase tracking-widest text-gray-800">LEVEL {lvl.level}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${lvl.badge} shadow-sm backdrop-blur-sm border border-white/30`}>
                                        {lvl.title}
                                    </span>
                                </div>
                                <p className="text-2xl sm:text-3xl font-black mb-4 tracking-tight text-gray-900">{lvl.subtitle}</p>

                                {/* XP bar */}
                                <div className="mb-2">
                                    <div className={`h-3.5 rounded-full overflow-hidden bg-white/50 border border-white/40 shadow-inner`}>
                                        <motion.div
                                            className={`h-full rounded-full relative bg-secondary`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(3, lvl.progress)}%` }} // So there's always a tiny bit visible
                                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                        >
                                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-[2px]" />
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between opacity-80 font-bold text-[11px] text-gray-800">
                                    <span>{xp} XP</span>
                                    {lvl.next ? (
                                        <span>{lvl.maxXp + 1 - xp} XP to <strong>{lvl.next.title}</strong></span>
                                    ) : (
                                        <span>🏆 Max Level!</span>
                                    )}
                                </div>
                            </div>

                            {/* XP flash */}
                            <div className="shrink-0 text-right">
                                <AnimatePresence>
                                    {lastXpGain !== null && (
                                        <motion.div key="xpflash"
                                            initial={{ opacity: 0, scale: 0.6, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                            className="inline-flex flex-col items-center"
                                        >
                                            <span className="text-3xl font-black drop-shadow-lg opacity-100">+{lastXpGain}</span>
                                            <span className="opacity-90 text-xs font-black">XP GAINED!</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {lastXpGain === null && (
                                    <div className="flex flex-col items-end gap-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <Zap size={22} className="fill-secondary text-secondary drop-shadow-sm" />
                                            <span className="text-4xl font-black tracking-tight">{xp}</span>
                                        </div>
                                        <span className="opacity-70 text-[10px] font-black tracking-widest text-gray-800">TOTAL XP</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Row: Quest progress + streak stats ── */}
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Quests Done', value: `${completedQuests}/${quests.length}`, icon: '⭐', color: 'bg-primary/10 border-primary/20' },
                            { label: 'XP Today', value: `+${totalQuestXp}`, icon: '⚡', color: 'bg-white border-gray-200 shadow-sm' },
                            { label: 'Day Streak', value: `${streak}🔥`, icon: '🏅', color: 'bg-secondary/10 border-secondary/20' },
                        ].map((stat, i) => (
                            <motion.div key={stat.label}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.06 }}
                                className={`rounded-xl border ${stat.color} px-4 py-3.5 flex flex-col items-center gap-1`}
                            >
                                <span className="text-2xl font-black text-text-primary">{stat.value}</span>
                                <span className="text-[11px] text-gray-500 font-medium">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Main grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Left: Quests + Achievements */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* Daily Quests */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
                                            <Star size={18} className="text-gray-900 fill-gray-900" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-text-primary">Daily Quests</h3>
                                            <p className="text-[11px] text-gray-400">Complete quests to earn XP & level up</p>
                                        </div>
                                    </div>
                                    {/* Quest progress ring (simplified) */}
                                    <div className="flex items-center gap-1.5">
                                        {quests.map(q => (
                                            <motion.div key={q.id}
                                                animate={{ scale: q.done ? [1, 1.4, 1] : 1 }}
                                                transition={{ duration: 0.3 }}
                                                className={`w-2.5 h-2.5 rounded-full ${q.done ? 'bg-primary' : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {quests.map((q, i) => {
                                        const meta = QUEST_META[q.id as QuestId];
                                        return (
                                            <motion.div key={q.id}
                                                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.25 + i * 0.06 }}
                                                className={`relative flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-300
                                                    ${q.done
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'}`}
                                            >
                                                {/* Icon */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all
                                                    ${q.done ? 'bg-primary text-gray-900 shadow-md' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                                    {meta?.icon}
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className={`text-sm font-semibold ${q.done ? 'text-gray-900 line-through opacity-70' : 'text-text-primary'}`}>
                                                            {q.label}
                                                        </p>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${DIFF_STYLE[meta?.difficulty ?? 'Easy']}`}>
                                                            {meta?.difficulty}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400">{q.description}</p>
                                                    {q.target > 1 && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-primary rounded-full"
                                                                    animate={{ width: `${(q.progress / q.target) * 100}%` }}
                                                                    transition={{ duration: 0.5 }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-medium text-gray-400">{q.progress}/{q.target}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* XP reward */}
                                                <div className="shrink-0 flex flex-col items-center gap-1 relative z-10">
                                                    {q.done ? (
                                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                                                            <CheckCircle2 size={18} className="text-gray-900" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <Lock size={14} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                    <span className={`text-[10px] font-bold ${q.done ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        +{q.xpReward}
                                                    </span>
                                                </div>

                                                {/* Shimmer on done */}
                                                {q.done && (
                                                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Achievements */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl border border-gray-200 p-5">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-md">
                                        <Trophy size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary">Achievements</h3>
                                        <p className="text-[11px] text-gray-400">{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length} unlocked</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {ACHIEVEMENTS.map((a, i) => (
                                        <motion.div key={a.id}
                                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.35 + i * 0.06 }}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all
                                                ${a.unlocked
                                                    ? 'border-secondary/30 bg-secondary/10 hover:-translate-y-0.5'
                                                    : 'border-gray-100 bg-gray-50 opacity-50 grayscale'}`}
                                        >
                                            <span className="text-2xl">{a.icon}</span>
                                            <span className={`text-[10px] font-bold ${a.unlocked ? 'text-secondary' : 'text-gray-400'}`}>
                                                {a.label}
                                            </span>
                                            {!a.unlocked && <Lock size={10} className="text-gray-300" />}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Upcoming + Quick access */}
                        <div className="space-y-5">

                            {/* Upcoming Deadlines */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                className="bg-white rounded-2xl border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shadow-sm">
                                            <TrendingUp size={16} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-text-primary">Upcoming</h3>
                                            <p className="text-[11px] text-gray-400">Task deadlines</p>
                                        </div>
                                    </div>
                                    <Link to="/tasks" className="flex items-center gap-0.5 text-[11px] text-gray-500 font-semibold hover:text-gray-900 transition-colors">
                                        All <ArrowRight size={11} />
                                    </Link>
                                </div>

                                {UPCOMING.length === 0 ? (
                                    <p className="text-center text-xs text-gray-400 py-8">No upcoming tasks 🎉</p>
                                ) : (
                                    <div className="space-y-3">
                                        {UPCOMING.map((task, i) => (
                                            <motion.div key={task.id}
                                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + i * 0.08 }}
                                                className="p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-primary/50 transition-all">
                                                <p className="text-xs font-semibold text-text-primary line-clamp-2 leading-snug mb-2">{task.title}</p>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                                        <Calendar size={10} /> {formatDate(task.date)}
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${PRIORITY_STYLE[task.priority]}`}>
                                                        <Flag size={9} className="inline mr-0.5" />{task.priority}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Level roadmap */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                className="bg-white rounded-2xl border border-gray-200 p-5">
                                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                                    <span>🗺️</span> Level Roadmap
                                </h3>
                                <div className="space-y-2">
                                    {LEVELS.map(l => {
                                        const reached = xp >= l.minXp;
                                        const current = lvl.level === l.level;
                                        return (
                                            <div key={l.level} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all
                                                ${current ? 'bg-primary/10 border border-primary/20' : ''}`}>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm
                                                    ${reached ? `${l.gradient} text-white shadow-sm` : 'bg-gray-100 text-gray-300 grayscale'}`}>
                                                    {l.level === 1 ? '🌱' : l.level === 2 ? '📘' : l.level === 3 ? '⚔️' : l.level === 4 ? '🎓' : '👑'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className={`text-xs font-bold w-full truncate ${current ? 'text-gray-900' : reached ? 'text-gray-600' : 'text-gray-400'}`}>
                                                            Lv.{l.level} · {l.title}
                                                        </p>
                                                        {current && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-900 text-white shrink-0">YOU</span>}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400">{l.minXp} XP</p>
                                                </div>
                                                {reached && !current && <span className="text-primary text-sm font-bold">✓</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Quick Access */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl border border-gray-200 p-5">
                                <h3 className="text-sm font-bold text-text-primary mb-3">Quick Access</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'Notes', icon: <FileText size={16} />, to: '/notes', color: 'bg-primary/20 text-yellow-800', emoji: '📝' },
                                        { label: 'Tasks', icon: <CheckSquare size={16} />, to: '/tasks', color: 'bg-orange-100 text-orange-600', emoji: '✅' },
                                        { label: 'Timer', icon: <Timer size={16} />, to: '/timer', color: 'bg-orange-200 text-orange-700', emoji: '⏱️' },
                                        { label: 'FloAI', icon: <Sparkles size={16} />, to: '/notes', color: 'bg-primary text-gray-900', emoji: '✨' },
                                    ].map((item, i) => (
                                        <motion.div key={item.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                            <Link to={item.to}>
                                                <div className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                                                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-md`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-gray-600">{item.label}</span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <FloatingAIButton onClick={() => setIsChatOpen(true)} />
            <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </DashboardLayout>
    );
};

export default Dashboard;
