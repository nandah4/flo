import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, ArrowRight, FileText, CheckSquare, Timer } from "lucide-react";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const HISTORY: { query: string; category: string }[] = [
    { query: "PBL Project Research", category: "Notes" },
    { query: "Design homepage hero section", category: "Tasks" },
    { query: "Calculus III Notes", category: "Notes" },
    { query: "Fix login bug on mobile", category: "Tasks" },
    { query: "Focus 25 min session", category: "Timer" },
];

const CATEGORY_ICON: Record<string, React.ReactNode> = {
    Notes: <FileText size={13} />,
    Tasks: <CheckSquare size={13} />,
    Timer: <Timer size={13} />,
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 80);
        } else {
            setQuery("");
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    const filtered = query.trim()
        ? HISTORY.filter(h => h.query.toLowerCase().includes(query.toLowerCase()))
        : HISTORY;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="search-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/60"
                        onClick={onClose}
                    />

                    {/* Search box — centered top */}
                    <motion.div
                        key="search-panel"
                        initial={{ opacity: 0, y: -16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-[12vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-[580px] 2xl:max-w-[720px] px-4"
                    >
                        {/* Input bar */}
                        <div className="flex items-center gap-3 2xl:gap-4 bg-white rounded-xl px-4 2xl:px-5 py-3.5 2xl:py-4 shadow-2xl border border-gray-200/60">
                            <Search size={18} className="text-gray-400 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search notes, tasks, timers..."
                                className="flex-1 text-sm 2xl:text-base text-text-primary placeholder:text-gray-400 outline-none bg-transparent"
                            />
                            {query && (
                                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                            {!query && (
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Gap + History/Results */}
                        <div className="mt-3 bg-white rounded-lg shadow-2xl border border-gray-200/60 overflow-hidden">
                            {/* Section label */}
                            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                                <span className="text-xs lg:text-sm 2xl:text-base font-medium text-text-primary uppercase">
                                    {query ? "Results" : "Recent searches"}
                                </span>
                            </div>

                            {filtered.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-gray-400">
                                    No results for "{query}"
                                </div>
                            ) : (
                                <ul className="pb-2">
                                    {filtered.map((item, i) => (
                                        <li key={i}>
                                            <button
                                                className="w-full flex items-center gap-3 2xl:gap-4 px-4 2xl:px-5 py-3 2xl:py-3.5 text-left hover:bg-gray-50 group transition-colors"
                                                onClick={onClose}
                                            >
                                                {/* Category icon + badge */}
                                                <span className="flex items-center gap-1.5 text-gray-400 shrink-0">
                                                    <Clock size={14} className="group-hover:hidden" />
                                                    <Search size={14} className="hidden group-hover:block text-secondary" />
                                                </span>

                                                {/* Query text */}
                                                <span className="flex-1 text-sm 2xl:text-base text-text-primary truncate">{item.query}</span>

                                                {/* Category pill */}
                                                <span className="flex items-center gap-1.5 text-xs 2xl:text-sm font-normal text-text-secondary bg-bg-app px-3 py-1.5 rounded shrink-0">
                                                    {CATEGORY_ICON[item.category]}
                                                    {item.category}
                                                </span>

                                                <ArrowRight size={14} className="text-text-secondary group-hover:text-secondary transition-colors shrink-0" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}


                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
