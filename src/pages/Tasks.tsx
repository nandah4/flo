"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import {
    Plus, MoreHorizontal, Kanban,
    ChevronLeft, ChevronRight, Send, Loader2,
    Flag, Target, Calendar, X, AlignLeft, Clock
} from "lucide-react";

import fAIAssistant from '../assets/images/icon-ai-assistant.png'

// Types
interface TaskCard {
    id: string;
    title?: string;
    date?: string;
    time?: string;
    description?: string;
    priority?: "High" | "Medium" | "Low";
    image?: string;
}

interface Column {
    id: string;
    label: string;
    color: string;
    cards: TaskCard[];
}

// Add Task Drawer form state
interface NewTaskForm {
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low" | "";
    columnId: string;
    date: string;
    time: string;
}

// Seed data
const initialColumns: Column[] = [
    {
        id: "todo", label: "To Do", color: "#111827",
        cards: [
            { id: "t1", title: "Write your goal. Flow will break it down for you.", priority: "High", image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400&q=80", date: "02/24", time: "12:11 PM", description: "Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been..." },
        ],
    },
    {
        id: "inprogress", label: "In Progress", color: "#3A9AFF",
        cards: [
            { id: "p1", title: "Write your goal. Flow will break it down for you.", priority: "Medium", date: "01/24", time: "14:11 PM", description: "Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been..." },
        ],
    },
    {
        id: "inreview", label: "In Review", color: "#FF8C00",
        cards: [],
    },
    {
        id: "done", label: "Done", color: "#10b981",
        cards: [],
    },
];

function formatTaskDate(dateStr?: string) {
    if (!dateStr) return "";
    const parts = dateStr.split('/');
    if (parts.length !== 2) return dateStr;
    const [month, day] = parts;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(month, 10) - 1] || "";
    return `${parseInt(day, 10)} ${monthName} 2026`;
}

// Add Task Drawer
const PRIORITY_OPTIONS: { value: "High" | "Medium" | "Low"; color: string; bg: string }[] = [
    { value: "High", color: "text-red-600", bg: "bg-red-50" },
    { value: "Medium", color: "text-orange-500", bg: "bg-orange-50" },
    { value: "Low", color: "text-green-600", bg: "bg-green-50" },
];

function AddTaskDrawer({
    open,
    onClose,
    columns,
    onAdd,
    defaultColumnId = "todo",
    editingCard = null,
}: {
    open: boolean;
    onClose: () => void;
    columns: Column[];
    onAdd: (columnId: string, card: TaskCard, isEdit: boolean) => void;
    defaultColumnId?: string;
    editingCard?: TaskCard | null;
}) {
    const [form, setForm] = useState<NewTaskForm>({
        title: "", description: "", priority: "", columnId: defaultColumnId, date: "", time: "",
    });

    // Sync form with editingCard or defaultColumnId when opened
    useEffect(() => {
        if (open) {
            if (editingCard) {
                // Determine which column this card belongs to by checking columns?
                let foundCol = defaultColumnId;
                for (const col of columns) {
                    if (col.cards.some(c => c.id === editingCard.id)) {
                        foundCol = col.id;
                        break;
                    }
                }
                setForm({
                    title: editingCard.title || "",
                    description: editingCard.description || "",
                    priority: editingCard.priority || "",
                    columnId: foundCol,
                    date: editingCard.date || "",
                    time: editingCard.time || "",
                });
            } else {
                setForm({ title: "", description: "", priority: "", columnId: defaultColumnId, date: "", time: "" });
            }
        }
    }, [open, editingCard, defaultColumnId, columns]);

    function reset() {
        setForm({ title: "", description: "", priority: "", columnId: defaultColumnId, date: "", time: "" });
    }

    function handleClose() { reset(); onClose(); }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.title.trim()) return;
        const card: TaskCard = {
            id: editingCard ? editingCard.id : `task-${Date.now()}`,
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            priority: form.priority || undefined,
            date: form.date || undefined,
            time: form.time || undefined,
        };
        onAdd(form.columnId, card, !!editingCard);
        handleClose();
    }

    const set = (field: keyof NewTaskForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={handleClose}
                    />

                    {/* Panel — slides from right on md+, centered modal on mobile */}
                    <motion.div
                        key="drawer"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className={[
                            "fixed z-50 bg-bg-app shadow-2xl flex flex-col mr-2 my-2",
                            // Desktop: right-side drawer
                            "md:inset-y-0 md:right-0 md:w-[520px] md:rounded-xl",
                            // Mobile/tablet: centered modal
                            "max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:rounded-xl max-md:max-h-[90vh]",
                        ].join(" ")}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0">
                            <div>
                                <h3 className="md:text-lg text-base font-medium text-gray-900">
                                    {editingCard ? "Edit Task" : "Add New Task"}
                                </h3>
                                <p className="text-sm text-text-secondary mt-0.5">Fill in the details below to create a task.</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-shadow-text-secondary hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable form body */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-5 px-6 py-4">

                                {/* Title */}
                                <div>
                                    <label className=" text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2"> <AlignLeft size={12} /> Title <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        value={form.title}
                                        onChange={set("title")}
                                        placeholder="e.g. Design homepage hero section"
                                        className="w-full text-xs text-gray-700 font-normal placeholder:text-gray-300 bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className=" text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2"> <AlignLeft size={12} /> Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows={3}
                                        value={form.description}
                                        onChange={set("description")}
                                        placeholder="Add more context or details..."
                                        className="w-full text-xs text-gray-700 font-normal placeholder:text-gray-300 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                                    />
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2"> <Target size={12} /> Priority <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2 flex-wrap">
                                        {PRIORITY_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setForm((p) => ({ ...p, priority: p.priority === opt.value ? "" : opt.value }))}
                                                className={`px-3 bg-white py-1.5 rounded-md text-xs font-normal uppercase tracking-wider border transition-all ${form.priority === opt.value
                                                    ? `${opt.bg} ${opt.color} border-current`
                                                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                                                    }`}
                                            >
                                                {opt.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Status / Column */}
                                <div>
                                    <label className=" text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2"> Status <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2 flex-wrap">
                                        {columns.map((col) => (
                                            <button
                                                key={col.id}
                                                type="button"
                                                onClick={() => setForm((p) => ({ ...p, columnId: col.id }))}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded  bg-white text-xs font-medium border transition-all ${form.columnId === col.id
                                                    ? "border-gray-300 text-gray-800"
                                                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                                                    }`}
                                            >
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                                                {col.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className=" text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2"> <Flag size={12} /> Due Date </label>
                                        <input
                                            type="date"
                                            value={form.date}
                                            onChange={(e) => {
                                                const raw = e.target.value; // YYYY-MM-DD
                                                if (raw) {
                                                    const [, mm, dd] = raw.split("-");
                                                    setForm((p) => ({ ...p, date: `${mm}/${dd}` }));
                                                } else {
                                                    setForm((p) => ({ ...p, date: "" }));
                                                }
                                            }}
                                            className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className=" text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2"> <Clock size={12} /> Time </label>
                                        <input
                                            type="time"
                                            value={form.time}
                                            onChange={set("time")}
                                            className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="mt-auto px-6 py-5 border-t border-gray-100 flex items-center gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-md border border-gray-200 text-sm font-normal text-gray-500 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-md bg-linear-to-t from-primary to-primary/80 text-text-primary text-sm font-normal hover:opacity-90 transition-opacity"
                                >
                                    {editingCard ? "Save Changes" : "Add Task"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Card component
function Card({ card, onCardClick, onDeleteClick }: { card: TaskCard; onCardClick: () => void; onDeleteClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onCardClick}
            className="bg-white rounded-xl p-4 border hover:-translate-y-1 border-gray-200 cursor-pointer transition-shadow"
        >
            {/* Header: 3-dots Menu */}
            <div className="flex items-start justify-end">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick();
                    }}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition-colors"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Title */}
            {card.title && (
                <div className="mb-2">
                    <p className="text-sm font-medium text-gray-800 leading-snug">{card.title}</p>
                </div>
            )}

            {/* Image */}
            {card.image && (
                <div className="rounded-md overflow-hidden mb-3">
                    <img src={card.image} alt="" className="w-full h-36 object-cover" />
                </div>
            )}

            {/* Description */}
            {card.description && (
                <p className="text-xs text-text-secondary mb-4 leading-relaxed line-clamp-2">{card.description}</p>
            )}

            {/* Footer: Date & Priority */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                {card.date ? (
                    <div className="flex items-center justify-start gap-x-1.5">
                        <Flag size={14} className="text-text-secondary" />
                        <span className="text-xs font-normal text-text-secondary">
                            {formatTaskDate(card.date)} {card.time ? `• ${card.time}` : ""}
                        </span>
                    </div>
                ) : <div />}

                {card.priority && (
                    <span
                        className={`px-2 py-1.5 rounded-md text-[10px] flex items-center gap-x-1.5 font-semibold uppercase tracking-wider ${card.priority === "High"
                            ? "bg-red-50 text-red-600"
                            : card.priority === "Medium"
                                ? "bg-orange-50 text-orange-500"
                                : "bg-green-50 text-green-600"
                            }`}
                    >
                        <Target size={12} />
                        {card.priority}
                    </span>
                )}
            </div>

        </motion.div>
    );
}

// Column component
function Column({
    col,
    onAddClick,
    onCardClick,
    onDeleteClick
}: {
    col: Column;
    onAddClick: (colId: string) => void;
    onCardClick: (card: TaskCard) => void;
    onDeleteClick: (colId: string, cardId: string) => void;
}) {
    return (
        <div className="flex flex-col gap-3 min-w-[240px] sm:min-w-[280px] flex-1">
            {/* Column header */}
            <div className="flex items-center justify-between px-2 bg-white py-2 rounded-md">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }}></div>
                    <span className="text-sm font-medium">
                        {col.label}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                        ({String(col.cards.length).padStart(2, "0")})
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onAddClick(col.id)}
                        className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                    <button className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
                <AnimatePresence>
                    {col.cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            onCardClick={() => onCardClick(card)}
                            onDeleteClick={() => onDeleteClick(col.id, card.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Calendar View
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarView({ columns }: { columns: Column[] }) {
    const [currentMonth, setCurrentMonth] = useState(1);
    const [currentYear] = useState(2026);

    // Gather all cards from all columns
    const allCards = columns.flatMap((col) =>
        col.cards.map((card) => ({ ...card, columnLabel: col.label, columnColor: col.color }))
    );

    // Build a map of day -> cards for the current month
    const cardsByDay: Record<number, typeof allCards> = {};
    allCards.forEach((card) => {
        if (!card.date) return;
        const [mm, dd] = card.date.split("/").map(Number);
        if (mm === currentMonth + 1) {
            if (!cardsByDay[dd]) cardsByDay[dd] = [];
            cardsByDay[dd].push(card);
        }
    });

    // Calendar math
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const today = new Date();
    const isToday = (day: number) =>
        today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    const prevMonth = () => setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    const nextMonth = () => setCurrentMonth((m) => (m === 11 ? 0 : m + 1));

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Month header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <div className="flex items-center gap-1">
                    <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 border-b border-gray-100">
                {DAY_LABELS.map((d) => (
                    <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>

            {/* Date grid */}
            <div className="grid grid-cols-7">
                {Array.from({ length: totalCells }, (_, i) => {
                    const day = i - firstDayOfWeek + 1;
                    const isValid = day >= 1 && day <= daysInMonth;
                    const dayCards = isValid ? cardsByDay[day] : undefined;

                    const hasTasks = dayCards && dayCards.length > 0;

                    return (
                        <div
                            key={i}
                            className={`min-h-[80px] sm:min-h-[100px] border-b border-r p-1 sm:p-1.5 transition-colors ${isValid
                                ? hasTasks
                                    ? "bg-primary/20 border-gray-100"
                                    : "border-gray-100 hover:bg-gray-50"
                                : "border-gray-100 bg-gray-50/40"
                                }`}
                        >
                            {isValid && (
                                <>
                                    <span
                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium mb-1 ${isToday(day)
                                            ? "bg-primary text-white"
                                            : "text-gray-700"
                                            }`}
                                    >
                                        {day}
                                    </span>
                                    {dayCards?.map((card) => (
                                        <div
                                            key={card.id}
                                            className="mb-1 px-2 py-2 rounded-md text-[11px] font-medium leading-tight truncate cursor-pointer hover:opacity-80 transition-opacity bg-amber-300"

                                            title={`${card.title}  |  ${card.columnLabel}`}
                                        >
                                            {card.title}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Delete Confirmation Modal
function DeleteModal({
    isOpen,
    onClose,
    onConfirm
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl relative"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
                            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 py-2.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Main Page
export default function Tasks() {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState("Kanban");
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Interaction states
    const [drawerColumnId, setDrawerColumnId] = useState<string>("todo");
    const [editingCard, setEditingCard] = useState<TaskCard | null>(null);
    const [deleteModalData, setDeleteModalData] = useState<{ colId: string, cardId: string } | null>(null);

    function handleAddCard(columnId: string, card: TaskCard, isEdit: boolean) {
        setColumns((prev) =>
            prev.map((col) => {
                if (isEdit) {
                    const filteredCards = col.cards.filter(c => c.id !== card.id);
                    if (col.id === columnId) {
                        return { ...col, cards: [card, ...filteredCards] };
                    }
                    return { ...col, cards: filteredCards };
                }

                if (col.id === columnId) {
                    return { ...col, cards: [card, ...col.cards] };
                }
                return col;
            })
        );
    }

    function handleDeleteCard(colId: string, cardId: string) {
        setColumns(prev => prev.map(col =>
            col.id === colId
                ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
                : col
        ));
    }
    async function handleGenerate() {
        if (!prompt.trim() || loading) return;
        setLoading(true);

        // Simulate AI generation delay
        await new Promise((r) => setTimeout(r, 1200));

        const newCard: TaskCard = {
            id: `ai-${Date.now()}`,
            title: prompt.trim(),
        };

        setColumns((prev) =>
            prev.map((col) =>
                col.id === "todo" ? { ...col, cards: [newCard, ...col.cards] } : col
            )
        );
        setPrompt("");
        setLoading(false);
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-5">
                {/* Top navbar */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6 flex items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">
                        Tasks
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setEditingCard(null);
                                setDrawerColumnId("todo");
                                setDrawerOpen(true);
                            }}
                            className="flex items-center gap-2 sm:w-auto bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-4! py-3! text-sm! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-lg!"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Create Task</span>
                        </button>
                    </div>
                </header>

                <div className="px-4 md:pr-10 md:pl-0 pb-2">
                    {/* AI Generate bar */}
                    <div className="mb-5 relative">
                        <p className="text-sm text-gray-500 mb-3 hidden sm:block">Describe your assignment or daily work, and let Flow's AI turn it into structured tasks in seconds.</p>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/10 transition-all">
                            <img src={fAIAssistant} alt="AI Assistant" className="w-7 h-7 shrink-0" />
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                placeholder="Generate a task with FloAI..."
                                className="flex-1 h-10 sm:h-14 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || loading}
                                className="flex items-center gap-2.5 bg-primary disabled:bg-bg-app text-text-primary disabled:text-gray-400 px-3.5 py-3 rounded-xl text-xs font-normal transition-colors shrink-0"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                                <span className="hidden sm:inline">{loading ? "Generating..." : "Generate"}</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* View tabs */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1.5">
                            {[
                                { label: "Kanban", icon: <Kanban size={14} /> },
                                { label: "Calendar", icon: <Calendar size={14} /> },

                            ].map((v) => (
                                <button
                                    key={v.label}
                                    onClick={() => setActiveView(v.label)}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${activeView === v.label
                                        ? "bg-primary/15 text-secondary"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {v.icon}
                                    {v.label}
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* View Content */}
                    {activeView === "Kanban" && (
                        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0">
                            {columns.map((col) => (
                                <Column
                                    key={col.id}
                                    col={col}
                                    onAddClick={(colId) => {
                                        setEditingCard(null);
                                        setDrawerColumnId(colId);
                                        setDrawerOpen(true);
                                    }}
                                    onCardClick={(card) => {
                                        setEditingCard(card);
                                        setDrawerColumnId("todo");
                                        setDrawerOpen(true);
                                    }}
                                    onDeleteClick={(colId, cardId) => {
                                        setDeleteModalData({ colId, cardId });
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {activeView === "Calendar" && (
                        <div className="pb-8">
                            <CalendarView columns={columns} />
                        </div>
                    )}
                </div>
            </div>

            {/* Add Task Drawer */}
            <AddTaskDrawer
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setTimeout(() => setEditingCard(null), 300);
                }}
                columns={columns}
                onAdd={handleAddCard}
                defaultColumnId={drawerColumnId}
                editingCard={editingCard}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={!!deleteModalData}
                onClose={() => setDeleteModalData(null)}
                onConfirm={() => {
                    if (deleteModalData) {
                        handleDeleteCard(deleteModalData.colId, deleteModalData.cardId);
                    }
                }}
            />

        </DashboardLayout>
    );
}