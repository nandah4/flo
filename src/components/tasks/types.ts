// Task domain types

export interface TaskCard {
    id: string;
    title?: string;
    date?: string;
    time?: string;
    startDate?: string;
    startTime?: string;
    description?: string;
    priority?: "High" | "Medium" | "Low";
    image?: string;
}

export interface Column {
    id: string;
    label: string;
    color: string;
    cards: TaskCard[];
}

/** Internal form state used by AddTaskDrawer */
export interface NewTaskForm {
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low" | "";
    columnId: string;
    startDate: string;
    startTime: string;
    date: string;
    time: string;
}

// Shared constants

export const PRIORITY_OPTIONS: { value: "High" | "Medium" | "Low"; color: string; bg: string }[] = [
    { value: "High", color: "text-red-600", bg: "bg-red-50" },
    { value: "Medium", color: "text-orange-500", bg: "bg-orange-50" },
    { value: "Low", color: "text-green-600", bg: "bg-green-50" },
];

// Shared helpers

/** Format "MM/DD" string → "D Mon 2026" */
export function formatTaskDate(dateStr?: string): string {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 2) return dateStr;
    const [month, day] = parts;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(month, 10) - 1] || "";
    return `${parseInt(day, 10)} ${monthName} 2026`;
}
