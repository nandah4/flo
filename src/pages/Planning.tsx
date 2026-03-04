"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, RefreshCw, Flag } from "lucide-react";
import DashboardLayout from "../ui/DashboardLayout";
import AddEventDrawer from "../components/planning/AddEventDrawer";
import type { CalEvent as DrawerCalEvent } from "../components/planning/AddEventDrawer";
import googleCalendarIcon from "../assets/images/google-calendar.png";

// Types
interface CalEvent {
    id: string;
    title: string;
    startHour: number;
    startMin: number;
    endHour: number;
    endMin: number;
    dayIndex: number; // 0=Mon
    source: "task" | "event"; // determines color
}

// Convert DrawerCalEvent → CalEvent for the grid
function drawerToGrid(ev: DrawerCalEvent, weekDates: Date[]): CalEvent | null {
    const [sh, sm] = ev.startTime.split(":").map(Number);
    const [eh, em] = ev.endTime.split(":").map(Number);
    const evDate = new Date(ev.startDate + "T00:00:00");
    const di = weekDates.findIndex(
        d => d.getDate() === evDate.getDate()
            && d.getMonth() === evDate.getMonth()
            && d.getFullYear() === evDate.getFullYear()
    );
    if (di === -1) return null;
    return {
        id: ev.id,
        title: ev.title,
        startHour: sh,
        startMin: sm,
        endHour: eh,
        endMin: em,
        dayIndex: di,
        source: ev.source,
    };
}

// Sample seed events
const SEED_EVENTS: CalEvent[] = [
    { id: "e1", title: "Design Task Card UI", startHour: 9, startMin: 0, endHour: 11, endMin: 0, dayIndex: 0, source: "task" },
    { id: "e3", title: "Morning Run", startHour: 6, startMin: 30, endHour: 7, endMin: 30, dayIndex: 0, source: "event" },
    { id: "e4", title: "Weekly Progress Report", startHour: 14, startMin: 0, endHour: 17, endMin: 0, dayIndex: 1, source: "task" },
    { id: "e5", title: "Repository Setup", startHour: 15, startMin: 0, endHour: 16, endMin: 0, dayIndex: 2, source: "task" },
    { id: "e6", title: "Review Auth Module PR", startHour: 10, startMin: 0, endHour: 11, endMin: 0, dayIndex: 3, source: "task" },
];

// Upcoming tasks (right sidebar)
const UPCOMING_TASKS = [
    { id: "u1", title: "Design Task Card UI", priority: "High", due: "Mar 5", col: "To Do", colColor: "#111827" },
    { id: "u2", title: "Weekly Progress Report", priority: "Medium", due: "Mar 4", col: "In Progress", colColor: "#3A9AFF" },
    { id: "u3", title: "Review Auth Module PR", priority: "High", due: "Mar 6", col: "In Review", colColor: "#FF8C00" },
    { id: "u4", title: "Repository Setup", priority: "Low", due: "Mar 3", col: "Done", colColor: "#10b981" },
];

// Upcoming events (right sidebar)
const UPCOMING_EVENTS = [
    { id: "v1", title: "Morning Run", time: "06:30 – 07:30", day: "Mon", color: "#FF8C00" },
];

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_SHORTS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getMondayOf(d: Date): Date {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(d);
    mon.setDate(d.getDate() + diff);
    mon.setHours(0, 0, 0, 0);
    return mon;
}

function getWeekDays(offsetWeeks: number): Date[] {
    const mon = getMondayOf(new Date());
    mon.setDate(mon.getDate() + offsetWeeks * 7);
    return Array.from({ length: 5 }, (_, i) => {
        const d = new Date(mon);
        d.setDate(mon.getDate() + i);
        return d;
    });
}

const HOUR_START = 6;
const HOUR_END = 22;
const ROW_H = 64; // px per hour

function fmtHour(h: number) {
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hh} ${ampm}`;
}

// Event block — positioned absolutely inside a day column
function EventBlock({ ev }: { ev: CalEvent }) {
    const isTask = ev.source === "task";
    const top = ((ev.startHour - HOUR_START) * 60 + ev.startMin) * (ROW_H / 60);
    const height = Math.max(
        ((ev.endHour - ev.startHour) * 60 + ev.endMin - ev.startMin) * (ROW_H / 60) - 2,
        26
    );
    return (
        <div
            className={[
                "absolute left-1 right-1 rounded-md overflow-hidden cursor-pointer transition-opacity hover:opacity-80",
                isTask
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-primary/20 border border-primary/30",
            ].join(" ")}
            style={{ top, height }}
        >
            <div className="pl-2.5 pr-1.5 pt-2.5 pb-1 flex flex-col gap-1 h-full">
                <p className={`text-sm font-medium leading-tight line-clamp-1 wrap-break-word ${isTask ? "text-[#3A9AFF]" : "text-secondary"}`}>
                    {ev.title}
                </p>
                {height > 36 && (
                    <div className="flex items-center gap-1">
                        <Clock size={11} className={isTask ? "text-[#3A9AFF]" : "text-secondary/70"} />
                        <span className={`text-[9px] sm:text-[11px] font-medium ${isTask ? "text-[#3A9AFF]" : "text-secondary/70"}`}>
                            {fmtHour(ev.startHour)}–{fmtHour(ev.endHour)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Planning() {
    const [weekOffset, setWeekOffset] = useState(0);
    const [events, setEvents] = useState<CalEvent[]>(SEED_EVENTS);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const weekDates = getWeekDays(weekOffset);
    const now = new Date();
    const todayIdx = weekDates.findIndex(
        d => d.getDate() === now.getDate()
            && d.getMonth() === now.getMonth()
            && d.getFullYear() === now.getFullYear()
    );

    const firstDate = weekDates[0];
    const lastDate = weekDates[4];
    const headerLabel = firstDate.getMonth() === lastDate.getMonth()
        ? `${MONTH_NAMES[firstDate.getMonth()]} ${firstDate.getFullYear()}`
        : `${MONTH_NAMES[firstDate.getMonth()]} – ${MONTH_NAMES[lastDate.getMonth()]} ${lastDate.getFullYear()}`;

    const totalH = (HOUR_END - HOUR_START) * ROW_H;
    const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

    function handleAddEvent(ev: DrawerCalEvent) {
        const grid = drawerToGrid(ev, weekDates);
        if (grid) setEvents(prev => [...prev, grid]);
    }

    return (
        <>
            <DashboardLayout>
                <div className="min-h-screen bg-bg-app font-sans pb-5">

                    {/* ── Header ── */}
                    <header className="px-4 md:pr-10 md:pl-0 pt-5 md:pt-6 flex items-center justify-between gap-3">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">Planning</h2>
                    </header>

                    <div className="px-4 md:pr-10 md:pl-0 pb-8 flex flex-col gap-5">

                        {/* ── Legend ── */}
                        <div className="flex items-end justify-between">
                            <div className="flex gap-4"><div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#3A9AFF" }} />
                                Task (from Tasks)
                            </div>
                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#FF8C00" }} />
                                    Event
                                </div></div>

                            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-text-secondary hover:border-secondary cursor-pointer transition-colors shrink-0">
                                <img src={googleCalendarIcon} alt="Google Calendar Icon" className="w-4 h-4" />
                                <span className="hidden sm:inline">Sync Google Calendar</span>
                            </button>
                        </div>

                        {/* ── Sidebar toolbar */}
                        <div className="lg:hidden flex items-center justify-between gap-3">
                            <h3 className="text-base font-medium text-text-primary whitespace-nowrap truncate min-w-0">{headerLabel}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                                    <button
                                        onClick={() => setWeekOffset(w => w - 1)}
                                        className="w-7 h-7 rounded-lg cursor-pointer hover:bg-bg-app flex items-center justify-center text-text-secondary transition-colors"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <button
                                        onClick={() => setWeekOffset(w => w + 1)}
                                        className="w-7 h-7 rounded-lg cursor-pointer hover:bg-bg-app flex items-center justify-center text-text-secondary transition-colors"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setDrawerOpen(true)}
                                    className="flex items-center gap-1.5 bg-linear-to-t from-primary to-primary/75 text-text-primary rounded-lg px-3 py-2 text-sm font-normal hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                    <Plus size={14} />
                                    Add Event
                                </button>
                            </div>
                        </div>

                        {/* ── Main layout: calendar + sidebar ── */}
                        <div className="flex flex-col lg:flex-row gap-5 items-start">

                            {/* Calendar */}
                            <div className="w-full lg:flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                                {/* Horizontally scrollable on narrow screens */}
                                <div className="overflow-x-auto">
                                    {/* Day headers */}
                                    <div
                                        className="grid border-b border-gray-100"
                                        style={{ gridTemplateColumns: "56px repeat(5, 1fr)", minWidth: 520 }}
                                    >
                                        <div className="py-3 text-xs text-text-secondary font-medium text-center border-r border-gray-100">
                                            GMT+7
                                        </div>
                                        {weekDates.map((d, i) => {
                                            const isToday = i === todayIdx;
                                            return (
                                                <div
                                                    key={d.toISOString()}
                                                    className={`py-3 text-center border-r border-gray-100 last:border-r-0 ${isToday ? "bg-primary/5" : ""}`}
                                                >
                                                    <p className={`text-xl font-medium ${isToday ? "text-secondary" : "text-text-primary"}`}>
                                                        {d.getDate()}
                                                    </p>
                                                    <p className={`text-[10px] font-medium uppercase ${isToday ? "text-secondary" : "text-text-secondary"}`}>
                                                        {DAY_SHORTS[d.getDay()]}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Time grid */}
                                    <div className="relative" style={{ minWidth: 520 }}>
                                        <div className="relative" style={{ height: totalH }}>
                                            {/* Hour rows */}
                                            {hours.map((h, i) => (
                                                <div
                                                    key={h}
                                                    className="absolute inset-x-0 grid border-t border-gray-100"
                                                    style={{
                                                        top: i * ROW_H,
                                                        height: ROW_H,
                                                        gridTemplateColumns: "56px repeat(5, 1fr)",
                                                    }}
                                                >
                                                    <div className="px-2 pt-1 text-[10px] text-text-secondary font-medium border-r border-gray-100 whitespace-nowrap">
                                                        {fmtHour(h)}
                                                    </div>
                                                    {weekDates.map((d, di) => (
                                                        <div
                                                            key={d.toISOString()}
                                                            className={`border-r border-gray-100 last:border-r-0 ${di === todayIdx ? "bg-primary/3" : ""}`}
                                                        />
                                                    ))}
                                                </div>
                                            ))}

                                            {/* Events overlay */}
                                            <div
                                                className="absolute inset-0 pointer-events-none grid"
                                                style={{ gridTemplateColumns: "56px repeat(5, 1fr)" }}
                                            >
                                                <div />
                                                {weekDates.map((_, di) => (
                                                    <div key={di} className="relative pointer-events-auto">
                                                        {events.filter(e => e.dayIndex === di).map(ev => (
                                                            <EventBlock key={ev.id} ev={ev} />
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right sidebar — hidden on mobile (controls are above calendar) */}
                            <div className="hidden lg:flex w-64 shrink-0 flex-col gap-4">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-base font-medium text-text-primary">{headerLabel}</h3>
                                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                                        <button
                                            onClick={() => setWeekOffset(w => w - 1)}
                                            className="w-7 h-7 rounded-lg cursor-pointer hover:bg-bg-app flex items-center justify-center text-text-secondary transition-colors"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <button
                                            onClick={() => setWeekOffset(w => w + 1)}
                                            className="w-7 h-7 rounded-lg cursor-pointer hover:bg-bg-app flex items-center justify-center text-text-secondary transition-colors"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Add Event */}
                                <button
                                    onClick={() => setDrawerOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-linear-to-t from-primary to-primary/75 text-text-primary rounded-lg py-3 text-sm font-normal hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                    <Plus size={15} />
                                    Add Event
                                </button>

                                {/* Upcoming Tasks */}
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-text-primary">Upcoming Tasks</h4>
                                        <span className="text-xs text-text-secondary bg-bg-app px-1.5 py-0.5 rounded-md">
                                            {UPCOMING_TASKS.length}
                                        </span>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-100">
                                        {UPCOMING_TASKS.map(t => {
                                            const priorityColor = t.priority === "High"
                                                ? "text-red-500 bg-red-50"
                                                : t.priority === "Medium"
                                                    ? "text-orange-500 bg-orange-50"
                                                    : "text-green-600 bg-green-50";
                                            return (
                                                <div key={t.id} className="px-4 py-3 hover:bg-bg-app transition-colors cursor-pointer">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm text-text-primary font-normal leading-tight flex-1">{t.title}</p>
                                                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded shrink-0 ${priorityColor}`}>
                                                            {t.priority}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.colColor }} />
                                                            {t.col}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                                                            <Flag size={11} />
                                                            {t.due}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Upcoming Events */}
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-text-primary">Upcoming Events</h4>
                                        <span className="text-xs text-text-secondary bg-bg-app px-1.5 py-0.5 rounded-md">
                                            {UPCOMING_EVENTS.length}
                                        </span>
                                    </div>
                                    <div className="flex flex-col divide-y divide-gray-100">
                                        {UPCOMING_EVENTS.map(ev => (
                                            <div key={ev.id} className="px-4 py-3 hover:bg-bg-app transition-colors cursor-pointer flex items-center gap-3">
                                                <span
                                                    className="w-2 h-2 rounded-full shrink-0"
                                                    style={{ backgroundColor: ev.color }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-text-primary font-normal leading-tight truncate">{ev.title}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-text-secondary">
                                                        <span>{ev.day}</span>
                                                        <span>·</span>
                                                        <span>{ev.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>{/* end flex-row */}

                        {/* ── Mobile sidebar cards (below calendar) ── */}
                        <div className="lg:hidden flex flex-col gap-4">
                            {/* Upcoming Tasks */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
                                <div className="px-4 py-3 flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-text-primary">Upcoming Tasks</h4>
                                    <span className="text-xs text-text-secondary bg-bg-app px-1.5 py-0.5 rounded-md">
                                        {UPCOMING_TASKS.length}
                                    </span>
                                </div>
                                <div className="grid sm:grid-cols-2 divide-y divide-gray-100 sm:divide-y-0">
                                    {UPCOMING_TASKS.map(t => {
                                        const priorityColor = t.priority === "High"
                                            ? "text-red-500 bg-red-50"
                                            : t.priority === "Medium"
                                                ? "text-orange-500 bg-orange-50"
                                                : "text-green-600 bg-green-50";
                                        return (
                                            <div key={t.id} className="px-4 py-3 hover:bg-bg-app transition-colors cursor-pointer border-b border-gray-100">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm text-text-primary font-normal leading-tight flex-1">{t.title}</p>
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${priorityColor}`}>
                                                        {t.priority}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.colColor }} />
                                                        {t.col}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                                                        <Flag size={9} />
                                                        {t.due}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
                                <div className="px-4 py-3 flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-text-primary">Upcoming Events</h4>
                                    <span className="text-xs text-text-secondary bg-bg-app px-1.5 py-0.5 rounded-md">
                                        {UPCOMING_EVENTS.length}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap divide-y divide-gray-100">
                                    {UPCOMING_EVENTS.map(ev => (
                                        <div key={ev.id} className="px-4 py-3 hover:bg-bg-app transition-colors cursor-pointer flex items-center gap-3 sm:w-1/2">
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-text-primary font-normal leading-tight truncate">{ev.title}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-text-secondary">
                                                    <span>{ev.day}</span>
                                                    <span>·</span>
                                                    <span>{ev.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>{/* end content wrapper */}
                </div>{/* end min-h-screen */}
            </DashboardLayout>

            <AddEventDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onAdd={handleAddEvent}
            />
        </>
    );
}