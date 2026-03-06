import type { Column, TaskCard } from "../components/tasks/types";

// 7 seeded tasks
export const seededTasks: TaskCard[] = [
    {
        id: "t1",
        title: "Design Task Card UI",
        priority: "High",
        image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400&q=80",
        startDate: "2026-03-05",
        startTime: "09:00",
        date: "03/05",
        time: "11:00",
        description: "Create a visually compelling hero section with clear CTA and brand messaging.",
    },
    {
        id: "t2",
        title: "Brainstorm Marketing Copy",
        priority: "Medium",
        date: "03/08",
        time: "15:00",
        description: "Draft 3 variations of the hero section headline and subtext.",
    },
    {
        id: "p1",
        title: "Write weekly progress report",
        priority: "Medium",
        startDate: "2026-03-04",
        startTime: "14:00",
        date: "03/04",
        time: "17:00",
        description: "Summarize this week's results across all active projects.",
    },
    {
        id: "p2",
        title: "Fix navigation bug on mobile",
        priority: "High",
        startDate: "2026-03-06",
        startTime: "08:00",
        date: "03/06",
        time: "12:00",
        description: "The hamburger menu isn't firing the onClick event properly on iOS.",
    },
    {
        id: "r1",
        title: "Review auth module refactor PR",
        priority: "High",
        date: "03/06",
        time: "10:00",
        description: "Check the refactored authentication module for edge cases and code quality.",
    },
    {
        id: "d1",
        title: "Set up project repository structure",
        priority: "Low",
        startDate: "2026-02-27",
        startTime: "09:00",
        date: "03/03",
        time: "12:00",
    },
    {
        id: "d2",
        title: "Install base dependencies",
        priority: "Medium",
        date: "03/02",
        time: "14:00",
        description: "React Router, Tailwind CSS, Framer Motion, and Lucide Icons.",
    }
];

// Group them by column
export const initialColumns: Column[] = [
    {
        id: "todo",
        label: "To Do",
        color: "#111827",
        cards: [seededTasks[0], seededTasks[1]],
    },
    {
        id: "inprogress",
        label: "In Progress",
        color: "#3A9AFF",
        cards: [seededTasks[2], seededTasks[3]],
    },
    {
        id: "inreview",
        label: "In Review",
        color: "#FF8C00",
        cards: [seededTasks[4]],
    },
    {
        id: "done",
        label: "Done",
        color: "#10b981",
        cards: [seededTasks[5], seededTasks[6]],
    },
];

// Helper for Dashboard: Calculate stats
export function getDashboardStats(columns: Column[]) {
    let completed = 0;
    let inProgress = 0;
    let inReview = 0;
    let overdue = 0; // Simple mock calculation (randomized for dashboard impression)

    columns.forEach(col => {
        if (col.id === 'done') completed += col.cards.length;
        if (col.id === 'inprogress') inProgress += col.cards.length;
        if (col.id === 'inreview') inReview += col.cards.length;
        if (col.id === 'todo') overdue += 1; // Assuming 1 task is overdue for visualization
    });

    const total = columns.reduce((acc, col) => acc + col.cards.length, 0);
    const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
        completed,
        inProgress,
        inReview,
        overdue,
        total,
        progressPercent
    };
}

// Helper for Dashboard: Get recent generic tasks list flattened
export function getRecentTasks(columns: Column[]) {
    const allTasks: { id: string; title: string; colId: string; priority?: string; date?: string }[] = [];
    columns.forEach(col => {
        col.cards.forEach(card => {
            allTasks.push({
                id: card.id,
                title: card.title || "Untitled Task",
                colId: col.id,
                priority: card.priority,
                date: card.date || "Today"
            });
        });
    });
    // Return newest/top 4 (random slice)
    return allTasks.slice(0, 4).map(t => ({
        ...t,
        status: t.colId === "done" ? "Done" : t.colId === "inreview" ? "In Review" : t.colId === "inprogress" ? "In Progress" : "Pending",
        time: t.colId === "done" ? "Completed" : "Today",
        date: t.date
    }));
}

// Helper for Planning: Get upcoming tasks mapped for the right sidebar
export function getUpcomingTasks(columns: Column[]) {
    // Collect tasks from todo, inprogress, inreview, done
    const upcoming: { id: string, title: string; time: string; type: string; priorityLabel: string; col: string; colColor: string; due: string }[] = [];
    columns.forEach(col => {
        col.cards.forEach(card => {
            upcoming.push({
                id: card.id,
                title: card.title || "Untitled",
                time: card.time ? `${card.time}` : "Flexible",
                type: "Task",
                priorityLabel: card.priority || "Low",
                col: col.label,
                colColor: col.color,
                due: card.date ? card.date : ""
            });
        });
    });
    // Filter to tasks that are not done
    const activeTasks = upcoming.filter(t => t.col !== "Done");
    return activeTasks.slice(0, 4);
}
