"use client";

import { useState } from "react";
import { useQuest } from "../context/QuestContext";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import DashboardLayout from "../ui/DashboardLayout";

// Components
import AddTaskDrawer from "../components/tasks/AddTaskDrawer";
import TaskColumn from "../components/tasks/TaskColumn";

import DeleteModal from "../components/tasks/DeleteModal";
import FloatingAIButton from "../components/common/FloatingAIButton";
import AIChatPanel from "../components/common/AIChatPanel";

// Types & seed data
import type { TaskCard, Column } from "../components/tasks/types";

import fAIAssistant from "../assets/images/icon-ai-assistant.png";

// Seed data

const initialColumns: Column[] = [
    {
        id: "todo", label: "To Do", color: "#111827",
        cards: [
            {
                id: "t1", title: "Design Task Card UI", priority: "High",
                image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400&q=80",
                startDate: "2026-03-05", startTime: "09:00", date: "03/05", time: "11:00",
                description: "Create a visually compelling hero section with clear CTA and brand messaging.",
            },
        ],
    },
    {
        id: "inprogress", label: "In Progress", color: "#3A9AFF",
        cards: [
            {
                id: "p1", title: "Write weekly progress report", priority: "Medium",
                startDate: "2026-03-04", startTime: "14:00", date: "03/04", time: "17:00",
                description: "Summarize this week's results across all active projects.",
            },
        ],
    },
    {
        id: "inreview", label: "In Review", color: "#FF8C00",
        cards: [
            {
                id: "r1", title: "Review auth module refactor PR", priority: "High",
                date: "03/06", time: "10:00",
                description: "Check the refactored authentication module for edge cases and code quality.",
            },
        ],
    },
    {
        id: "done", label: "Done", color: "#10b981",
        cards: [
            { id: "d1", title: "Set up project repository structure", priority: "Low", startDate: "2026-02-27", startTime: "09:00", date: "03/03", time: "12:00" },
        ],
    },
];

// Page

export default function Tasks() {
    const { progressQuest } = useQuest();
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerColumnId, setDrawerColumnId] = useState<string>("todo");
    const [editingCard, setEditingCard] = useState<TaskCard | null>(null);

    // Modal state
    const [deleteModalData, setDeleteModalData] = useState<{ colId: string; cardId: string } | null>(null);

    // AI panel
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Handlers

    function handleAddCard(columnId: string, card: TaskCard, isEdit: boolean) {
        if (columnId === "done") progressQuest("task");
        setColumns((prev) =>
            prev.map((col) => {
                if (isEdit) {
                    const filtered = col.cards.filter((c) => c.id !== card.id);
                    return col.id === columnId
                        ? { ...col, cards: [card, ...filtered] }
                        : { ...col, cards: filtered };
                }
                return col.id === columnId
                    ? { ...col, cards: [card, ...col.cards] }
                    : col;
            })
        );
    }

    function handleDeleteCard(colId: string, cardId: string) {
        setColumns((prev) =>
            prev.map((col) =>
                col.id === colId
                    ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
                    : col
            )
        );
    }

    async function handleGenerate() {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        const newCard: TaskCard = { id: `ai-${Date.now()}`, title: prompt.trim() };
        setColumns((prev) =>
            prev.map((col) =>
                col.id === "todo" ? { ...col, cards: [newCard, ...col.cards] } : col
            )
        );
        setPrompt("");
        setLoading(false);
    }

    function openDrawerFor(colId: string, card: TaskCard | null = null) {
        setEditingCard(card);
        setDrawerColumnId(colId);
        setDrawerOpen(true);
    }

    function closeDrawer() {
        setDrawerOpen(false);
        setTimeout(() => setEditingCard(null), 300);
    }

    // Render



    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-5">
                {/* Page header */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6 flex items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">Tasks</h2>
                </header>

                <div className="px-4 md:pr-10 md:pl-0 pb-2">
                    {/* AI Generate bar */}
                    <div className="mb-5 relative">
                        <p className="text-sm text-gray-500 mb-3 hidden sm:block">
                            Describe your assignment or daily work, and let Flow's AI turn it into structured tasks in seconds.
                        </p>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/10 transition-all">
                            <img src={fAIAssistant} alt="AI Assistant" className="w-7 h-7 shrink-0" />
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                placeholder='Create a task "Weekly Progress Report" — description: summarize this weeks results, priority: High, status: To Do, start: March 5 at 09:00, end: March 5 at 11:00.'
                                className="flex-1 h-10 sm:h-12 text-sm text-text-primary placeholder:text-text-secondary outline-none bg-transparent"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || loading}
                                className="flex items-center gap-2.5 bg-linear-to-t from-primary to-primary/75 disabled:bg-linear-to-t disabled:from-bg-app/90 disabled:to-bg-app/80 text-text-primary disabled:text-text-secondary px-3.5 py-3 rounded-lg text-sm font-normal transition-colors shrink-0"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                <span className="hidden sm:inline">{loading ? "Generating..." : "Generate"}</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Kanban */}
                    <h4 className="text-lg font-medium text-text-primary mb-3">Kanban Board</h4>
                    <div className="flex gap-4 md:gap-5 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0">
                        {columns.map((col) => (
                            <TaskColumn
                                key={col.id}
                                col={col}
                                onAddClick={(colId) => openDrawerFor(colId)}
                                onCardClick={(card) => openDrawerFor("todo", card)}
                                onDeleteClick={(colId, cardId) => setDeleteModalData({ colId, cardId })}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Add / Edit Task Drawer */}
            <AddTaskDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                columns={columns}
                onAdd={handleAddCard}
                defaultColumnId={drawerColumnId}
                editingCard={editingCard}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={!!deleteModalData}
                onClose={() => setDeleteModalData(null)}
                onConfirm={() => {
                    if (deleteModalData) handleDeleteCard(deleteModalData.colId, deleteModalData.cardId);
                }}
            />

            <FloatingAIButton onClick={() => setIsChatOpen(true)} />
            <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </DashboardLayout>
    );
}