import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, Target, Calendar, Image } from "lucide-react";
import type { Column, TaskCard, NewTaskForm } from "./types";
import { PRIORITY_OPTIONS } from "./types";

interface AddTaskDrawerProps {
    open: boolean;
    onClose: () => void;
    columns: Column[];
    onAdd: (columnId: string, card: TaskCard, isEdit: boolean) => void;
    defaultColumnId?: string;
    editingCard?: TaskCard | null;
    defaultDate?: string;
}

export default function AddTaskDrawer({
    open,
    onClose,
    columns,
    onAdd,
    defaultColumnId = "todo",
    editingCard = null,
    defaultDate = "",
}: AddTaskDrawerProps) {
    const [form, setForm] = useState<NewTaskForm>({
        title: "", description: "", priority: "", columnId: defaultColumnId,
        startDate: "", startTime: "", date: "", time: "",
    });
    const [openMeta, setOpenMeta] = useState<"priority" | "status" | null>(null);
    const [imageFiles, setImageFiles] = useState<{ name: string; url: string }[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Sync form with editingCard or defaultColumnId when opened
    useEffect(() => {
        if (open) {
            if (editingCard) {
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
                    startDate: "", startTime: "",
                    date: editingCard.date || "",
                    time: editingCard.time || "",
                });
            } else {
                setForm({
                    title: "", description: "", priority: "",
                    columnId: defaultColumnId,
                    startDate: "", startTime: "",
                    date: defaultDate, time: "",
                });
            }
        }
    }, [open, editingCard, defaultColumnId, columns]);

    function reset() {
        setForm({
            title: "", description: "", priority: "",
            columnId: defaultColumnId,
            startDate: "", startTime: "",
            date: defaultDate, time: "",
        });
        setOpenMeta(null);
        setImageFiles([]);
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
            startDate: form.startDate || undefined,
            startTime: form.startTime || undefined,
            date: form.date || undefined,
            time: form.time || undefined,
        };
        onAdd(form.columnId, card, !!editingCard);
        handleClose();
    }

    const set = (field: keyof NewTaskForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={handleClose}
                    />

                    {/* Panel */}
                    <motion.div
                        key="drawer"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className={[
                            "fixed z-50 bg-bg-app shadow-2xl flex rounded-lg sm:rounded-none flex-col",
                            "md:inset-y-0 md:right-0 md:w-[550px] 2xl:w-[660px]",
                            "max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:max-h-[80vh]",
                        ].join(" ")}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-start border-b border-gray-200 shrink-0">
                            <button
                                onClick={handleClose}
                                className="p-3.5 2xl:p-4 flex items-center border-r border-gray-200 justify-center text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <span className="text-sm 2xl:text-base font-medium text-text-primary pl-3 2xl:pl-4">
                                {editingCard ? "Edit Task" : "Create Task"}
                            </span>
                        </div>

                        {/* Scrollable form body */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-3 px-4 sm:px-5 2xl:px-7 py-3 sm:py-4 2xl:py-5">

                                {/* Title */}
                                <input
                                    required
                                    value={form.title}
                                    onChange={set("title")}
                                    placeholder="Task title..."
                                    className="w-full text-lg sm:text-xl 2xl:text-2xl font-medium text-text-primary placeholder:text-text-secondary bg-transparent outline-none border-none px-0 py-2 sm:py-3 2xl:py-3.5"
                                />

                                {/* Metadata rows */}
                                <div className="flex flex-col gap-1.5 sm:gap-2 2xl:gap-3">

                                    {/* Priority */}
                                    <div className="flex items-start gap-2 px-2">
                                        <div className="flex items-center w-28 gap-3 text-sm 2xl:text-base font-medium text-text-secondary pt-0.5">
                                            <Flag size={16} />
                                            <span>Priority</span>
                                        </div>
                                        <div className="flex-1">
                                            {openMeta === "priority" ? (
                                                <div className="flex gap-2 flex-wrap">
                                                    {PRIORITY_OPTIONS.map((opt) => (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setForm((p) => ({ ...p, priority: p.priority === opt.value ? "" : opt.value }));
                                                                setOpenMeta(null);
                                                            }}
                                                            className={`px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded text-xs 2xl:text-sm font-normal border transition-all ${form.priority === opt.value
                                                                ? `${opt.bg} ${opt.color} border-current`
                                                                : "bg-white border-gray-200 text-text-secondary hover:border-gray-300"
                                                                }`}
                                                        >
                                                            {opt.value}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenMeta("priority")}
                                                    className={`px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded text-xs 2xl:text-sm font-normal border transition-all ${form.priority
                                                        ? `${PRIORITY_OPTIONS.find(o => o.value === form.priority)?.bg} ${PRIORITY_OPTIONS.find(o => o.value === form.priority)?.color} border-current`
                                                        : "bg-white border-gray-200 text-text-secondary hover:border-gray-300"
                                                        }`}
                                                >
                                                    {form.priority || "Select…"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2 px-2">
                                        <div className="flex items-center w-28 gap-3 shrink-0 text-sm 2xl:text-base font-medium text-text-secondary pt-0.5">
                                            <Target size={16} />
                                            <span>Status</span>
                                        </div>
                                        <div className="flex-1">
                                            {openMeta === "status" ? (
                                                <div className="flex gap-2 flex-wrap">
                                                    {columns.map((col) => (
                                                        <button
                                                            key={col.id}
                                                            type="button"
                                                            onClick={() => { setForm((p) => ({ ...p, columnId: col.id })); setOpenMeta(null); }}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded text-xs 2xl:text-sm font-normal border transition-all ${form.columnId === col.id
                                                                ? "border-gray-400 text-gray-800 bg-white"
                                                                : "bg-white border-gray-200 text-text-secondary hover:border-gray-300"
                                                                }`}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                                                            {col.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenMeta("status")}
                                                    className="flex items-center gap-1.5 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded text-xs 2xl:text-sm font-normal border bg-white border-gray-200 text-text-secondary hover:border-gray-300 transition-all"
                                                >
                                                    {(() => {
                                                        const col = columns.find(c => c.id === form.columnId);
                                                        return col ? (
                                                            <>
                                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                                                                {col.label}
                                                            </>
                                                        ) : "Select…";
                                                    })()}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Start Date + Time */}
                                    <div className="flex items-start gap-2 px-2 py-1">
                                        <div className="flex items-center gap-3 w-24 sm:w-28 pt-0.5 shrink-0 text-sm 2xl:text-base font-medium text-text-secondary">
                                            <Calendar size={15} />
                                            <span>Start</span>
                                        </div>
                                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                                            <input
                                                type="date"
                                                value={form.startDate}
                                                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                                                className="w-full sm:flex-1 text-xs 2xl:text-sm text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                            <input
                                                type="time"
                                                value={form.startTime}
                                                onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                                                className="text-xs 2xl:text-sm text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Due Date + Time */}
                                    <div className="flex items-start gap-2 px-2 py-1">
                                        <div className="flex items-center gap-3 w-24 sm:w-28 shrink-0 pt-0.5 text-sm 2xl:text-base font-medium text-text-secondary">
                                            <Calendar size={15} />
                                            <span>Due</span>
                                        </div>
                                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                                            <input
                                                type="date"
                                                value={form.date ? (() => { const [mm, dd] = form.date.split("/"); return `2026-${mm}-${dd}`; })() : ""}
                                                onChange={(e) => {
                                                    const raw = e.target.value;
                                                    if (raw) { const [, mm, dd] = raw.split("-"); setForm((p) => ({ ...p, date: `${mm}/${dd}` })); }
                                                    else setForm((p) => ({ ...p, date: "" }));
                                                }}
                                                className="w-full sm:flex-1 text-xs 2xl:text-sm text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                            <input
                                                type="time"
                                                value={form.time}
                                                onChange={set("time")}
                                                className="text-xs 2xl:text-sm text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="flex items-start gap-2 px-2">
                                        <div className="flex items-center w-28 gap-3 shrink-0 text-sm 2xl:text-base font-medium text-text-secondary pt-0.5">
                                            <Image size={16} />
                                            <span>Images</span>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                ref={imageInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files ?? []);
                                                    const mapped = files.map((f) => ({
                                                        name: f.name,
                                                        url: URL.createObjectURL(f),
                                                    }));
                                                    setImageFiles((prev) => [...prev, ...mapped]);
                                                    if (imageInputRef.current) imageInputRef.current.value = "";
                                                }}
                                            />
                                            <div className="flex flex-wrap items-center gap-2">
                                                {imageFiles.map((img, idx) => (
                                                    <div key={idx} className="relative group w-14 h-14 2xl:w-16 2xl:h-16 rounded-md overflow-hidden border border-gray-200 shrink-0">
                                                        <img
                                                            src={img.url}
                                                            alt={img.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={14} className="text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => imageInputRef.current?.click()}
                                                    className="flex items-center gap-1.5 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded text-xs 2xl:text-sm font-normal border border-gray-200 bg-white text-text-secondary hover:border-gray-300 transition-all"
                                                >
                                                    <Image size={12} />
                                                    {imageFiles.length > 0 ? "Add more" : "Upload"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <textarea
                                        value={form.description}
                                        onChange={set("description")}
                                        onInput={(e) => {
                                            const el = e.target as HTMLTextAreaElement;
                                            el.style.height = "auto";
                                            el.style.height = el.scrollHeight + "px";
                                        }}
                                        placeholder="Add more context or details here..."
                                        className="mt-5 w-full text-sm 2xl:text-base text-text-primary font-normal placeholder:text-text-secondary outline-none resize-none overflow-hidden"
                                    />
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="mt-auto px-4 sm:px-6 2xl:px-7 py-4 sm:py-5 2xl:py-6 flex items-center gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 2xl:py-3 rounded-md border cursor-pointer border-gray-200 text-sm 2xl:text-base font-normal text-gray-500 bg-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 2xl:py-3 rounded-md cursor-pointer bg-linear-to-t from-primary to-primary/80 text-text-primary text-sm 2xl:text-base font-normal hover:opacity-90 transition-opacity"
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
