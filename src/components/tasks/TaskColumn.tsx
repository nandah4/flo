import { AnimatePresence } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Column, TaskCard as TaskCardType } from "./types";

interface TaskColumnProps {
    col: Column;
    onAddClick: (colId: string) => void;
    onCardClick: (card: TaskCardType) => void;
    onDeleteClick: (colId: string, cardId: string) => void;
}

export default function TaskColumn({ col, onAddClick, onCardClick, onDeleteClick }: TaskColumnProps) {
    return (
        <div className="flex flex-col gap-3 2xl:gap-4 min-w-[240px] sm:min-w-[280px] 2xl:min-w-[320px] flex-1">
            {/* Column header */}
            <div className="flex items-center justify-between px-2 bg-white py-2 rounded-md">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-sm 2xl:text-base font-medium">{col.label}</span>
                    <span className="text-xs 2xl:text-sm text-gray-400 font-medium">
                        ({String(col.cards.length).padStart(2, "0")})
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* Add Task Button */}
            <button
                onClick={() => onAddClick(col.id)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 2xl:py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <Plus size={16} className="text-gray-500" />
                <span className="text-sm 2xl:text-base font-normal text-text-secondary">Add Task</span>
            </button>

            {/* Cards */}
            <div className="flex flex-col gap-3">
                <AnimatePresence>
                    {col.cards.map((card) => (
                        <TaskCard
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
