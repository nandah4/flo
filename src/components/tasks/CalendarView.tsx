import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Column, TaskCard } from "./types";

// Constants

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helpers

/** Parse "MM/DD" date string (year assumed 2026) into a Date at midnight */
function parseDueDate(dateStr: string): Date | null {
    const [mm, dd] = dateStr.split("/").map(Number);
    if (!mm || !dd) return null;
    return new Date(2026, mm - 1, dd, 0, 0, 0, 0);
}

type RangeDay = {
    card: TaskCard & { columnLabel: string; columnColor: string };
    position: "start" | "middle" | "end" | "solo";
};

// Component

interface CalendarViewProps {
    columns: Column[];
    onDayClick: (dateStr: string) => void;
    onCardClick: (card: TaskCard) => void;
}

export default function CalendarView({ columns, onDayClick, onCardClick }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(1);
    const [currentYear] = useState(2026);

    // Gather all cards from all columns with column metadata
    const allCards = columns.flatMap((col) =>
        col.cards.map((card) => ({ ...card, columnLabel: col.label, columnColor: col.color }))
    );

    // Calendar math
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const today = new Date();
    const isToday = (day: number) =>
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;

    const prevMonth = () => setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    const nextMonth = () => setCurrentMonth((m) => (m === 11 ? 0 : m + 1));

    const toDateStr = (day: number) => {
        const mm = String(currentMonth + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return `${mm}/${dd}`;
    };

    // Build per-day data — ranges vs solo pills
    const rangesByDay: Record<number, RangeDay[]> = {};
    const soloByDay: Record<number, typeof allCards> = {};

    allCards.forEach((card) => {
        const dueDate = card.date ? parseDueDate(card.date) : null;
        const startDate = card.startDate ? new Date(card.startDate + "T00:00:00") : null;

        if (startDate && dueDate && startDate < dueDate) {
            // Range card — span every day in the range
            const cursor = new Date(startDate);
            while (cursor <= dueDate) {
                if (cursor.getFullYear() === currentYear && cursor.getMonth() === currentMonth) {
                    const d = cursor.getDate();
                    if (!rangesByDay[d]) rangesByDay[d] = [];
                    const isStart = cursor.getTime() === startDate.getTime();
                    const isEnd = cursor.getTime() === dueDate.getTime();
                    rangesByDay[d].push({
                        card,
                        position: isStart && isEnd ? "solo" : isStart ? "start" : isEnd ? "end" : "middle",
                    });
                }
                cursor.setDate(cursor.getDate() + 1);
            }
        } else if (dueDate && dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear) {
            // Solo due-date card
            const d = dueDate.getDate();
            if (!soloByDay[d]) soloByDay[d] = [];
            soloByDay[d].push(card);
        }
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5">
                <h3 className="text-lg font-semibold text-text-primary">
                    {MONTH_NAMES[currentMonth]}
                    <span className="text-text-secondary font-normal ml-1.5">{currentYear}</span>
                </h3>
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={prevMonth}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-white hover:text-text-primary transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-white hover:text-text-primary transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 border-t border-gray-100">
                {DAY_LABELS.map((d, i) => (
                    <div
                        key={d}
                        className={`py-2.5 text-center text-[11px] font-semibold uppercase tracking-widest ${i === 0 || i === 6 ? "text-gray-300" : "text-gray-400"}`}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Date grid */}
            <div className="grid grid-cols-7 border-t border-gray-100">
                {Array.from({ length: totalCells }, (_, i) => {
                    const day = i - firstDayOfWeek + 1;
                    const isValid = day >= 1 && day <= daysInMonth;
                    const isWeekend = i % 7 === 0 || i % 7 === 6;
                    const rangeDays = isValid ? (rangesByDay[day] ?? []) : [];
                    const soloDays = isValid ? (soloByDay[day] ?? []) : [];
                    const hasTasks = rangeDays.length > 0 || soloDays.length > 0;

                    return (
                        <div
                            key={i}
                            onClick={() => isValid && onDayClick(toDateStr(day))}
                            className={`min-h-[90px] sm:min-h-[110px] border-b border-r border-gray-100 transition-colors relative ${isValid
                                ? `cursor-pointer ${isWeekend
                                    ? "bg-gray-50/60 hover:bg-gray-100/60"
                                    : "hover:bg-primary/3"
                                }`
                                : "bg-gray-50/30"
                                }`}
                        >
                            {isValid && (
                                <>
                                    {/* Day number */}
                                    <div className="p-1.5 pb-0">
                                        <span
                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold mb-1 ${isToday(day)
                                                ? "bg-secondary text-white shadow-sm shadow-secondary/30"
                                                : isWeekend
                                                    ? "text-gray-400"
                                                    : "text-gray-700"
                                                }`}
                                        >
                                            {day}
                                        </span>
                                    </div>

                                    {/* Range bars */}
                                    <div className="flex flex-col gap-0.5">
                                        {rangeDays.slice(0, 2).map(({ card, position }) => (
                                            <div
                                                key={card.id}
                                                onClick={(e) => { e.stopPropagation(); onCardClick(card); }}
                                                title={`${card.title} · ${card.columnLabel}`}
                                                className={`h-5 flex items-center cursor-pointer hover:opacity-80 transition-opacity
                                                    ${position === "start" ? "ml-1.5 rounded-l-md" : ""}
                                                    ${position === "end" ? "mr-1.5 rounded-r-md" : ""}
                                                    ${position === "solo" ? "mx-1.5 rounded-md" : ""}
                                                `}
                                                style={{ backgroundColor: card.columnColor + "25" }}
                                            >
                                                {(position === "start" || position === "solo") && (
                                                    <span
                                                        className="shrink-0 w-1.5 h-1.5 rounded-full ml-1.5"
                                                        style={{ backgroundColor: card.columnColor }}
                                                    />
                                                )}
                                                {(position === "start" || position === "solo") && (
                                                    <span
                                                        className="text-[10px] font-medium ml-1 truncate"
                                                        style={{ color: card.columnColor }}
                                                    >
                                                        {card.title}
                                                    </span>
                                                )}
                                                {position === "end" && (
                                                    <span
                                                        className="shrink-0 w-1.5 h-1.5 rounded-full mr-1.5 ml-auto"
                                                        style={{ backgroundColor: card.columnColor }}
                                                    />
                                                )}
                                            </div>
                                        ))}

                                        {/* Solo due-date pills */}
                                        {soloDays.slice(0, 2).map((card) => (
                                            <div
                                                key={card.id}
                                                onClick={(e) => { e.stopPropagation(); onCardClick(card); }}
                                                className="mx-1.5 mb-0.5 px-2 py-0.5 rounded-md text-[11px] font-medium leading-tight truncate cursor-pointer hover:opacity-75 transition-opacity text-white"
                                                style={{ backgroundColor: card.columnColor }}
                                                title={`${card.title} · ${card.columnLabel}`}
                                            >
                                                {card.title}
                                            </div>
                                        ))}

                                        {/* +N more */}
                                        {hasTasks && (rangeDays.length + soloDays.length) > 2 && (
                                            <span className="text-[10px] text-text-secondary pl-2">
                                                +{rangeDays.length + soloDays.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Start of range
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                    <span className="w-6 h-2 rounded bg-gray-300" />
                    Duration
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-gray-400 ml-auto" />
                    Due date
                </div>
            </div>
        </div>
    );
}
