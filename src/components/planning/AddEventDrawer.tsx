import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, AlignLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalEvent {
    id: string;
    title: string;
    notes?: string;
    startDate: string;  // "YYYY-MM-DD"
    startTime: string;  // "HH:MM"
    endDate: string;    // "YYYY-MM-DD"
    endTime: string;    // "HH:MM"
    /** "task" (from Tasks feature) | "event" (user-created in Planning) */
    source: "task" | "event";
}

interface AddEventDrawerProps {
    open: boolean;
    onClose: () => void;
    onAdd: (event: CalEvent) => void;
    /** Pre-fill date when clicking a day cell */
    defaultDate?: string;
}

interface Form {
    title: string;
    notes: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
}

function todayISO() {
    const d = new Date();
    return d.toISOString().split("T")[0];
}

function nowTime() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}

function addHour(time: string) {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const next = Math.min(h + 1, 23);
    return `${String(next).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddEventDrawer({
    open,
    onClose,
    onAdd,
    defaultDate = "",
}: AddEventDrawerProps) {
    const today = todayISO();
    const [form, setForm] = useState<Form>({
        title: "",
        notes: "",
        startDate: defaultDate || today,
        startTime: nowTime(),
        endDate: defaultDate || today,
        endTime: addHour(nowTime()),
    });

    // Reset when drawer opens
    useEffect(() => {
        if (open) {
            const t = nowTime();
            setForm({
                title: "",
                notes: "",
                startDate: defaultDate || today,
                startTime: t,
                endDate: defaultDate || today,
                endTime: addHour(t),
            });
        }
    }, [open]);

    const set =
        (field: keyof Form) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setForm((p) => ({ ...p, [field]: e.target.value }));

    function handleClose() { onClose(); }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.title.trim()) return;
        onAdd({
            id: `ev-${Date.now()}`,
            title: form.title.trim(),
            notes: form.notes.trim() || undefined,
            startDate: form.startDate,
            startTime: form.startTime,
            endDate: form.endDate,
            endTime: form.endTime,
            source: "event",
        });
        handleClose();
    }

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

                    {/* Panel */}
                    <motion.div
                        key="drawer"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className={[
                            "fixed z-50 bg-bg-app shadow-2xl flex rounded-lg sm:rounded-none flex-col",
                            "md:inset-y-0 md:right-0 md:w-[480px]",
                            "max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:max-h-[90vh]",
                        ].join(" ")}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-start border-b border-gray-200 shrink-0">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="p-3.5 flex items-center border-r border-gray-200 justify-center text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <span className="text-sm font-medium text-text-primary pl-3">
                                Add Event
                            </span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-3 px-4 sm:px-5 py-3 sm:py-4">

                                {/* Title */}
                                <input
                                    required
                                    value={form.title}
                                    onChange={set("title")}
                                    placeholder="Event title..."
                                    className="w-full text-lg sm:text-xl font-medium text-text-primary placeholder:text-text-secondary bg-transparent outline-none border-none px-0 py-2 sm:py-3"
                                />

                                {/* Divider */}
                                <div className="border-t border-gray-100" />

                                {/* Metadata rows */}
                                <div className="flex flex-col gap-1">

                                    {/* Start */}
                                    <div className="flex items-start px-2 py-1.5">
                                        <div className="flex items-center gap-3 w-28 shrink-0 text-xs text-text-secondary pt-0.5">
                                            <Calendar size={15} />
                                            <span>Starts</span>
                                        </div>
                                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-1.5">
                                            <input
                                                type="date"
                                                value={form.startDate}
                                                onChange={set("startDate")}
                                                className="flex-1 text-xs text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                            <input
                                                type="time"
                                                value={form.startTime}
                                                onChange={set("startTime")}
                                                className="text-xs text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* End */}
                                    <div className="flex items-start px-2 py-1.5">
                                        <div className="flex items-center gap-3 w-28 shrink-0 text-xs text-text-secondary pt-0.5">
                                            <Calendar size={15} />
                                            <span>Ends</span>
                                        </div>
                                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-1.5">
                                            <input
                                                type="date"
                                                value={form.endDate}
                                                onChange={set("endDate")}
                                                className="flex-1 text-xs text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                            <input
                                                type="time"
                                                value={form.endTime}
                                                onChange={set("endTime")}
                                                className="text-xs text-text-secondary bg-transparent outline-none border-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-100 my-1" />

                                    {/* Notes */}
                                    <div className="flex items-start px-2 py-1.5">
                                        <div className="flex items-center gap-3 w-28 shrink-0 text-xs text-text-secondary pt-0.5">
                                            <AlignLeft size={15} />
                                            <span>Notes</span>
                                        </div>
                                        <textarea
                                            value={form.notes}
                                            onChange={set("notes")}
                                            onInput={(e) => {
                                                const el = e.target as HTMLTextAreaElement;
                                                el.style.height = "auto";
                                                el.style.height = el.scrollHeight + "px";
                                            }}
                                            placeholder="Add notes..."
                                            rows={2}
                                            className="flex-1 text-sm text-text-primary font-normal placeholder:text-text-secondary outline-none resize-none overflow-hidden bg-transparent border-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 shrink-0 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-md border cursor-pointer border-gray-200 text-sm font-normal text-gray-500 bg-white transition-colors hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-md cursor-pointer bg-linear-to-t from-primary to-primary/80 text-text-primary text-sm font-normal hover:opacity-90 transition-opacity"
                                >
                                    Add Event
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
