export type NotificationType = 'task_overdue' | 'planning_upcoming' | 'streak_alert' | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    date: string;
    read: boolean;
    archived: boolean;
}

export const initialNotifications: Notification[] = [
    {
        id: "notif-1",
        type: "task_overdue",
        title: "Overdue Task",
        message: "Your task 'Finish Math Assignment' was due yesterday.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: false,
        archived: false,
    },
    {
        id: "notif-2",
        type: "planning_upcoming",
        title: "Upcoming Event",
        message: "Meeting with Project Group starts in 30 minutes.",
        date: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
        read: false,
        archived: false,
    },
    {
        id: "notif-3",
        type: "streak_alert",
        title: "Streak at Risk!",
        message: "Complete one task today to maintain your 5-day streak.",
        date: new Date().toISOString(),
        read: false,
        archived: false,
    },
    {
        id: "notif-4",
        type: "system",
        title: "Welcome to Flo",
        message: "Thanks for trying out Flo! Learn how to manage your workflow better.",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        read: true,
        archived: true,
    },
];
