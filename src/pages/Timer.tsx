"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import {
    Play, Pause, RotateCcw, SkipForward, Maximize2, X,
    GripVertical, Plus, Minus, ChevronDown, ChevronUp,
    CircleCheckBig, CircleDashed, StickyNote, ListTodo, Coffee,
    Timer as TimerIcon,
} from "lucide-react";

import patternZenMode from "../assets/images/pattern-zen-mode.png";
import FloatingAIButton from "../components/common/FloatingAIButton";
import AIChatPanel from "../components/common/AIChatPanel";

type Mode = "focus" | "short" | "long";

interface PomodoroTask {
    id: string;
    title: string;
    done: boolean;
    pomodoros: number;
    completedPomodoros: number;
}

// Seed data
const INITIAL_TASKS: PomodoroTask[] = [
    { id: "pt1", title: "Design homepage hero section", done: false, pomodoros: 3, completedPomodoros: 1 },
    { id: "pt2", title: "Write weekly report", done: false, pomodoros: 2, completedPomodoros: 0 },
    { id: "pt3", title: "Review pull requests", done: true, pomodoros: 1, completedPomodoros: 1 },
    { id: "pt4", title: "Fix login bug on mobile", done: false, pomodoros: 2, completedPomodoros: 0 },
    { id: "pt5", title: "Update API documentation", done: false, pomodoros: 1, completedPomodoros: 0 },
];

const MODE_CONFIG: Record<Mode, { label: string; defaultMins: number; color: string; accent: string }> = {
    focus: { label: "Focus", defaultMins: 25, color: "text-primary", accent: "#FF8C00" },
    short: { label: "Short Break", defaultMins: 5, color: "text-emerald-500", accent: "#10b981" },
    long: { label: "Long Break", defaultMins: 15, color: "text-sky-500", accent: "#3b82f6" },
};

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ progress, accent, size = 280 }: { progress: number; accent: string; size?: number }) {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);

    return (
        <svg width={size} height={size} className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-90deg)" }}>
            {/* Track */}
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={14} />
            {/* Progress */}
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={accent}
                strokeWidth={11}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.4s ease" }}
            />
        </svg>
    );
}

// Main Page
export default function Timer() {
    // Responsive circle size
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Timer state
    const [mode, setMode] = useState<Mode>("focus");
    const [settings, setSettings] = useState({ focus: 25, short: 5, long: 15 });
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);

    // Zen mode
    const [zenMode, setZenMode] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Tasks
    const [tasks, setTasks] = useState<PomodoroTask[]>(INITIAL_TASKS);
    const [activeTaskId, setActiveTaskId] = useState<string | null>("pt1");
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [addingTask, setAddingTask] = useState(false);

    // Notes
    const [notes, setNotes] = useState("");
    const [settingsOpen, setSettingsOpen] = useState(false);

    const activeTask = tasks.find((t) => t.id === activeTaskId);
    const totalSeconds = settings[mode] * 60;
    const progress = timeLeft / totalSeconds;
    const { accent } = MODE_CONFIG[mode];

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Tick
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        setIsRunning(false);
                        setSessionCount((s) => s + 1);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current!);
        }
        return () => clearInterval(intervalRef.current!);
    }, [isRunning]);

    // Reset when mode or settings change
    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(settings[mode] * 60);
    }, [mode, settings]);

    function switchMode(m: Mode) {
        setMode(m);
        setIsRunning(false);
        setTimeLeft(settings[m] * 60);
    }

    function skip() {
        const order: Mode[] = ["focus", "short", "long"];
        const next = order[(order.indexOf(mode) + 1) % order.length];
        switchMode(next);
    }

    function formatTime(secs: number) {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function toggleTask(id: string) {
        setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
    }

    function moveTask(id: string, dir: "up" | "down") {
        setTasks((prev) => {
            const idx = prev.findIndex((t) => t.id === id);
            if (dir === "up" && idx === 0) return prev;
            if (dir === "down" && idx === prev.length - 1) return prev;
            const arr = [...prev];
            const target = dir === "up" ? idx - 1 : idx + 1;
            [arr[idx], arr[target]] = [arr[target], arr[idx]];
            return arr;
        });
    }

    function addTask() {
        if (!newTaskTitle.trim()) return;
        const t: PomodoroTask = {
            id: `pt-${Date.now()}`, title: newTaskTitle.trim(),
            done: false, pomodoros: 1, completedPomodoros: 0,
        };
        setTasks((prev) => [t, ...prev]);
        setNewTaskTitle("");
        setAddingTask(false);
    }

    // Timer panel content shared between normal and zen mode
    function TimerPanel({ zen = false }) {
        return (
            <div className={`flex flex-col w-full items-center gap-6 ${zen ? "justify-center flex-1" : ""}`}>

                {/* Mode tabs */}
                <div className="flex items-center gap-1 bg-bg-app rounded-md p-1">
                    {(["focus", "short", "long"] as Mode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-3 py-1.5 rounded-md text-xs font-normal transition-all ${mode === m ? "bg-primary/20 text-secondary" : "text-gray-400 hover:text-gray-700"}`}
                        >
                            {MODE_CONFIG[m].label}
                        </button>
                    ))}
                </div>

                {/* Clock */}
                {(() => {
                    const circleSize = zen ? 340 : isMobile ? 220 : 280;
                    return (
                        <div className="relative flex items-center justify-center" style={{ width: circleSize, height: circleSize }}>
                            <CircularProgress progress={progress} accent={accent} size={circleSize} />
                            <div className="flex flex-col items-center gap-1 z-10">
                                <span className={`font-semibold tracking-tight tabular-nums text-text-primary ${zen ? "text-6xl" : isMobile ? "text-4xl" : "text-5xl"}`}>
                                    {formatTime(timeLeft)}
                                </span>
                                <span className="text-xs text-text-secondary font-normal">
                                    {MODE_CONFIG[mode].label}
                                </span>
                            </div>
                        </div>
                    );
                })()}

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={resetTimer}
                        className="w-10 h-10 cursor-pointer hover:border hover:border-gray-300 rounded-full bg-bg-app hover:bg-bg-app-hover flex items-center justify-center text-text-secondary transition-colors"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={() => setIsRunning((r) => !r)}
                        className="w-14 h-14 cursor-pointer rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: accent }}
                    >
                        {isRunning ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
                    </button>
                    <button
                        onClick={skip}
                        className="w-10 h-10 hover:border hover:border-gray-300 cursor-pointer rounded-full bg-bg-app hover:bg-bg-app-hover flex items-center justify-center text-text-secondary transition-colors"
                    >
                        <SkipForward size={16} />
                    </button>
                </div>

                {/* Session count */}
                <div className="flex items-center w-full sm:justify-center gap-2 text-text-secondary">
                    <TimerIcon size={16} />
                    <span className="text-xs font-normal ">{sessionCount} sessions completed today</span>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-6">
                {/* Header */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6 flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">Focus Timer </h2>
                </header>

                {/* 5-col grid */}
                <div className="px-4 md:pr-10 md:pl-0 grid grid-cols-1 lg:grid-cols-5 gap-4">

                    {/* LEFT — 3 cols: timer + settings */}
                    <div className="lg:col-span-3 flex flex-col gap-4">

                        {/* Timer card */}
                        <div className="bg-white rounded-2xl  border-gray-200 p-6 flex flex-col items-center gap-4 relative min-h-[440px] justify-center">
                            <TimerPanel />

                            {/* Zen Mode button — bottom-right */}
                            <button
                                onClick={() => setZenMode(true)}
                                className="absolute bottom-4 right-4 flex items-center gap-2.5 text-sm text-text-primary hover:text-gray-600 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                                <Maximize2 size={16} />
                                Zen Mode
                            </button>
                        </div>

                        {/* Settings card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <span className="flex items-center gap-2 text-text-primary">
                                    <Coffee size={16} />
                                    Timer Settings
                                </span>
                                {settingsOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                            </button>

                            <AnimatePresence>
                                {settingsOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 grid grid-cols-3 gap-4 pt-4">
                                            {([
                                                { key: "focus", label: "Focus", icon: <TimerIcon size={15} />, color: "text-secondary" },
                                                { key: "short", label: "Short Break", icon: <Coffee size={14} />, color: "text-emerald-500" },
                                                { key: "long", label: "Long Break", icon: <Coffee size={15} />, color: "text-sky-500" },
                                            ] as const).map(({ key, label, icon, color }) => (
                                                <div key={key} className="flex flex-col gap-2.5">
                                                    <label className={`flex items-center gap-1.5 text-xs font-normal ${color}`}>
                                                        {icon} {label}
                                                    </label>
                                                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                                        <button
                                                            onClick={() => {
                                                                setSettings((s) => ({ ...s, [key]: Math.max(1, s[key] - 1) }));
                                                                if (mode === key) setTimeLeft((t) => Math.max(60, t - 60));
                                                            }}
                                                            className="text-gray-400 hover:text-gray-700 transition-colors"
                                                        >
                                                            <Minus size={13} />
                                                        </button>

                                                        <span className="flex-1 text-center text-sm font-semibold tabular-nums text-gray-800">
                                                            {settings[key]}m
                                                        </span>

                                                        <button
                                                            onClick={() => {
                                                                setSettings((s) => ({ ...s, [key]: Math.min(90, s[key] + 1) }));
                                                                if (mode === key) setTimeLeft((t) => t + 60);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-700 transition-colors"
                                                        >
                                                            <Plus size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-5 pb-4">
                                            <p className="text-xs text-text-secondary">Changes to the active mode reset the timer. Long break after every 4 sessions.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT — 2 cols: tasks + notes */}
                    <div className="lg:col-span-2 flex flex-col gap-4">

                        {/* Task panel */}
                        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden flex-1">
                            {/* Panel header */}
                            <div className="flex items-center justify-between px-4 py-3.5">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <ListTodo size={18} className="text-text-primary" />
                                    Task Queue
                                </div>
                                <button
                                    onClick={() => setAddingTask(true)}
                                    className="w-7 h-7 cursor-pointer rounded-md hover:bg-gray-100 flex items-center justify-center text-text-secondary transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Add task input */}
                            <AnimatePresence>
                                {addingTask && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-b border-gray-100"
                                    >
                                        <div className="px-4 py-3 flex items-center gap-2">
                                            <input
                                                autoFocus
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") addTask();
                                                    if (e.key === "Escape") setAddingTask(false);
                                                }}
                                                placeholder="New task name..."
                                                className="flex-1 font-normal text-sm text-text-primary placeholder:text-text-secondary outline-none bg-transparent"
                                            />
                                            <button onClick={addTask} className="text-xs text-text-primary font-medium hover:opacity-80">Add</button>
                                            <button onClick={() => setAddingTask(false)} className="text-text-secondary hover:text-gray-500"><X size={16} /></button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Task list */}
                            <div className="flex flex-col divide-y divide-gray-50 overflow-y-auto max-h-[380px]">
                                <AnimatePresence>
                                    {tasks.length === 0 && (
                                        <div className="py-10 flex flex-col items-center gap-2 text-gray-300">
                                            <ListTodo size={28} />
                                            <p className="text-sm">No tasks yet</p>
                                        </div>
                                    )}
                                    {tasks.map((task, idx) => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.97 }}
                                            onClick={() => setActiveTaskId(task.id)}
                                            className={`flex items-center gap-3 px-4 py-4.5 cursor-pointer group transition-colors`}
                                        >
                                            {/* Done toggle */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                                className="shrink-0 text-gray-300 transition-colors"
                                            >
                                                {task.done
                                                    ? <CircleCheckBig size={17} className="text-secondary" />
                                                    : <CircleDashed size={17} />}
                                            </button>

                                            {/* Title */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-normal leading-snug ${task.done ? "line-through text-gray-500" : "text-text-secondary"}`}>
                                                    {task.title}
                                                </p>
                                            </div>

                                            {/* Active indicator */}
                                            {activeTaskId === task.id && (
                                                <span className="text-xs font-normal text-secondary bg-primary/20 px-2.5 py-1.5 rounded-md shrink-0">Active</span>
                                            )}

                                            {/* Reorder buttons */}
                                            <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button onClick={(e) => { e.stopPropagation(); moveTask(task.id, "up"); }} disabled={idx === 0} className="text-text-secondary hover:text-text-secondary">
                                                    <GripVertical size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Notes panel */}
                        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col">
                            <div className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-gray-700">
                                <StickyNote size={16} className="text-text-primary" />
                                Session Notes
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Jot down thoughts, blockers, or focus intent for this session..."
                                rows={5}
                                className="flex-1 px-4 py-3 text-sm text-text-secondary placeholder:text-text-secondary/80 outline-none resize-none rounded-b-2xl bg-transparent leading-relaxed"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Bubble — hidden in zen mode */}
            {!zenMode && (
                <>
                    <FloatingAIButton onClick={() => setIsChatOpen(true)} />
                    <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                </>
            )}

            {/* ── Zen Mode Overlay ── */}
            <AnimatePresence>
                {zenMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-bg-app overflow-hidden"
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <img
                                src={patternZenMode}
                                alt="Zen mode background"
                                className="w-full h-full object-cover opacity-40"
                            />
                        </div>

                        {/* Exit button */}
                        <button
                            onClick={() => setZenMode(false)}
                            className="absolute sm:top-6 sm:right-6 top-2 right-2 w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary transition-colors hover:bg-gray-200 z-10"
                        >
                            <X size={20} />
                        </button>

                        {/* Active task label */}
                        {activeTask && (
                            <motion.p
                                initial={{ y: -8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-text-secondary text-sm font-normal mb-8 relative z-10"
                            >
                                Focusing on: <span className="text-text-secondary">{activeTask.title}</span>
                            </motion.p>
                        )}

                        {/* Zen timer */}
                        <div className="relative flex items-center justify-center z-10" style={{ width: 340, height: 340 }}>
                            <svg width={340} height={340} className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-90deg)" }}>
                                <circle cx={170} cy={170} r={155} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
                                <circle
                                    cx={170} cy={170} r={155}
                                    fill="none"
                                    stroke={accent === "#6366f1" ? "#818cf8" : accent}
                                    strokeWidth={10}
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 155}
                                    strokeDashoffset={2 * Math.PI * 155 * (1 - progress)}
                                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                                />
                            </svg>
                            <div className="flex flex-col items-center gap-2 z-10">
                                <span className="text-7xl font-semibold text-text-secondary tabular-nums tracking-tight">
                                    {formatTime(timeLeft)}
                                </span>
                                <span className="text-text-secondary text-sm font-normal">
                                    {MODE_CONFIG[mode].label}
                                </span>
                            </div>
                        </div>

                        {/* Zen controls */}
                        <div className="flex items-center gap-6 mt-10 relative z-10">
                            <button
                                onClick={resetTimer}
                                className="w-12 h-12 rounded-full bg-white border cursor-pointer hover:scale-105 active:scale-95 border-gray-200 flex items-center justify-center text-text-secondary/60transition-colors"
                            >
                                <RotateCcw size={18} />
                            </button>
                            <button
                                onClick={() => setIsRunning((r) => !r)}
                                className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                                style={{ backgroundColor: accent === "#6366f1" ? "#818cf8" : accent }}
                            >
                                {isRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                            </button>
                            <button
                                onClick={skip}
                                className="w-12 h-12 rounded-full bg-white border cursor-pointer hover:scale-105 active:scale-95 border-gray-200 flex items-center justify-center text-text-secondary/60transition-colors"
                            >
                                <SkipForward size={18} />
                            </button>
                        </div>

                        {/* Mode tabs in Zen */}
                        <div className="flex items-center gap-1 mt-8 bg-white border border-gray-200 rounded-xl p-1 relative z-10">
                            {(["focus", "short", "long"] as Mode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => switchMode(m)}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-normal! transition-all ${mode === m ? "bg-primary/20 text-secondary" : "text-gray-400 hover:text-gray-700"}`}
                                >
                                    {MODE_CONFIG[m].label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
