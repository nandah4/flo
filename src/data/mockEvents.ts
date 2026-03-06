export interface CalEvent {
    id: string;
    title: string;
    startHour: number;
    startMin: number;
    endHour: number;
    endMin: number;
    dayIndex: number;
    source: "task" | "event"; // determines color
}

// 5 Sample seed events to be used globally
export const initialEvents: CalEvent[] = [
    { id: "e1", title: "Design Task Card UI", startHour: 9, startMin: 0, endHour: 11, endMin: 0, dayIndex: 0, source: "task" },
    { id: "e3", title: "Morning Run", startHour: 6, startMin: 30, endHour: 7, endMin: 30, dayIndex: 0, source: "event" },
    { id: "e4", title: "Weekly Progress Report", startHour: 14, startMin: 0, endHour: 17, endMin: 0, dayIndex: 1, source: "task" },
    { id: "e5", title: "Repository Setup", startHour: 15, startMin: 0, endHour: 16, endMin: 0, dayIndex: 2, source: "task" },
    { id: "e6", title: "Review Auth Module PR", startHour: 10, startMin: 0, endHour: 11, endMin: 0, dayIndex: 3, source: "task" },
];

const DAY_SHORTS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper for Planning: Get upcoming events formatted for the sidebar
export function getUpcomingEvents(events: CalEvent[]) {
    return events.slice(0, 3).map(ev => {
        // format time
        const sh = ev.startHour.toString().padStart(2, '0');
        const sm = ev.startMin.toString().padStart(2, '0');
        const eh = ev.endHour.toString().padStart(2, '0');
        const em = ev.endMin.toString().padStart(2, '0');

        const jsDayIndex = ev.dayIndex === 6 ? 0 : ev.dayIndex + 1;
        const dayStr = DAY_SHORTS[jsDayIndex];

        return {
            id: ev.id,
            title: ev.title,
            time: `${sh}:${sm} – ${eh}:${em}`,
            day: dayStr,
            color: ev.source === 'task' ? '#3A9AFF' : '#FF8C00',
        };
    });
}
import type { Column, TaskCard } from "../components/tasks/types";

// Helper for Planning: Get active tasks as events mapped to the grid
export function getTasksAsEvents(columns: Column[]): CalEvent[] {
    const events: CalEvent[] = [];

    // We only want to show todo, inprogress, inreview tasks on the calendar
    const activeColumns = columns.filter(col => col.id !== "done");

    const today = new Date();
    const currentYear = today.getFullYear();

    activeColumns.forEach(col => {
        col.cards.forEach((task: TaskCard) => {
            // we need startHour, endHour
            let startHour = 9;
            let startMin = 0;
            let endHour = 10;
            let endMin = 0;

            if (task.startTime) {
                const [h, m] = task.startTime.split(':').map(Number);
                startHour = h;
                startMin = m;
                endHour = Math.min(h + 1, 23); 
                endMin = m;
            }

            // Figure out dayIndex 0-6 (Mon-Sun).
            let dayIndex = 0;
            if (task.date) {
                // task.date is "MM/DD"
                const [mStr, dStr] = task.date.split('/');
                const d = new Date(currentYear, parseInt(mStr) - 1, parseInt(dStr));
                dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
            }

            events.push({
                id: task.id,
                title: task.title || "Untitled Task",
                startHour,
                startMin,
                endHour,
                endMin,
                dayIndex,
                source: "task"
            });
        });
    });

    return events;
}
