import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Target, Calendar, Flag } from "lucide-react";
import type { TaskCard } from "./types";
import { formatTaskDate } from "./types";

interface CardProps {
    card: TaskCard;
    onCardClick: () => void;
    onDeleteClick: () => void;
}

export default function TaskCard({ card, onCardClick, onDeleteClick }: CardProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onCardClick}
            className="bg-white rounded-xl p-4 2xl:p-5 border hover:-translate-y-1 border-gray-200 cursor-pointer transition-shadow"
        >
            {/* Header: priority badge + context menu */}
            <div className="flex items-start justify-between mb-3">
                {card.priority && (
                    <span
                        className={`px-2 py-1.5 2xl:px-2.5 2xl:py-2 rounded-md text-[10px] 2xl:text-xs flex items-center gap-x-1.5 font-semibold uppercase tracking-wider ${card.priority === "High"
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

                {/* Context menu trigger */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition-colors"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {menuOpen && (
                            <>
                                {/* Click-outside overlay */}
                                <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setMenuOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-8 z-40 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => { setMenuOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors text-left"
                                    >
                                        {/* Archive icon */}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                            <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
                                        </svg>
                                        Archive task
                                    </button>
                                    <div className="border-t border-gray-100" />
                                    <button
                                        onClick={() => { setMenuOpen(false); onDeleteClick(); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                                    >
                                        {/* Trash icon */}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                                        </svg>
                                        Delete
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Title */}
            {card.title && (
                <div className="mb-3">
                    <p className="text-base 2xl:text-lg font-medium text-text-primary">{card.title}</p>
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
                <p className="text-sm 2xl:text-base text-text-secondary mb-3 2xl:mb-4 leading-relaxed line-clamp-2">{card.description}</p>
            )}

            {/* Footer: dates */}
            <div className="mt-2 pt-3 2xl:pt-4 border-t border-gray-100 space-y-1">
                {(card.startDate || card.startTime) && (
                    <div className="flex items-center gap-1.5 text-xs 2xl:text-sm text-text-secondary">
                        <Calendar size={12} className="shrink-0" />
                        <span>
                            {card.startDate ? new Date(card.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ""}
                            {card.startTime ? ` ${card.startTime}` : ""}
                            {" → "}
                            {card.date ? formatTaskDate(card.date) : "—"}
                            {card.time ? ` ${card.time}` : ""}
                        </span>
                    </div>
                )}
                {!card.startDate && card.date && (
                    <div className="flex items-center gap-1.5 text-xs 2xl:text-sm text-text-secondary">
                        <Flag size={12} className="shrink-0" />
                        <span>{formatTaskDate(card.date)}{card.time ? ` • ${card.time}` : ""}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
