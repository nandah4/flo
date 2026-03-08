import { useState, useRef, useEffect } from "react";
import { X, CheckSquare, Calendar, Flame, Info, Check, Bell, Timer } from "lucide-react";
import { initialNotifications, type Notification } from "../../data/mockNotifications";

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    sidebarCollapsed?: boolean;
}

export default function NotificationPanel({ isOpen, onClose, sidebarCollapsed }: NotificationPanelProps) {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const unreadCount = notifications.filter((n) => !n.read && !n.archived).length;

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => (!n.archived ? { ...n, read: true } : n)));
    };

    const handleToggleRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );
    };

    const getFilteredNotifications = () => {
        let filtered = notifications.filter(n => !n.archived);
        if (activeTab === "unread") {
            filtered = filtered.filter((n) => !n.read);
        }
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const getIconForType = (type: Notification["type"]) => {
        switch (type) {
            case "task_overdue":
                return <div className="p-1.5 bg-red-100/50 text-red-500 rounded-lg"><CheckSquare size={16} /></div>;
            case "planning_upcoming":
                return <div className="p-1.5 bg-blue-100/50 text-blue-500 rounded-lg"><Calendar size={16} /></div>;
            case "streak_alert":
                return <div className="p-1.5 bg-orange-100/50 text-orange-500 rounded-lg"><Flame size={16} /></div>;
            case "system":
            default:
                return <div className="p-1.5 bg-gray-100/50 text-gray-500 rounded-lg"><Info size={16} /></div>;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const filteredItems = getFilteredNotifications();

    // Desktop positioning logic based on sidebar collapse state
    const leftPosition = sidebarCollapsed ? "sm:left-[95px]" : "sm:left-[290px]";

    return (
        <>
            {/* Mobile Overlay (Only visible on small screens) */}
            <div
                className="fixed inset-0 z-40 bg-black/20 sm:hidden transition-opacity"
                onClick={onClose}
            />

            {/* Panel Container */}
            <div
                ref={panelRef}
                className={`fixed z-50 bg-white flex flex-col overflow-hidden border border-gray-100 
          /* Mobile constraints - centered */
          top-5 left-1/2 -translate-x-1/2  w-[90%] max-w-md h-[72vh] rounded-lg
          /* Desktop constraints */
          sm:translate-x-0 sm:translate-y-0 sm:bottom-auto sm:top-6 sm:w-[420px] sm:h-[600px] sm:max-h-[85vh] transition-all duration-300 ${leftPosition}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h2 className="text-base sm:text-lg font-medium text-text-primary">Notifications</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-app hover:text-text-primary transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs & Actions */}
                <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                        {(["all", "unread"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === tab
                                    ? "bg-bg-app text-text-primary"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {tab === "unread" && unreadCount > 0 && (
                                    <span className="ml-1.5 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs sm:text-sm font-normal text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                    >
                        <Check size={18} />
                        Mark all as read
                    </button>
                </div>

                {/* Notification List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                <Bell size={20} />
                            </div>
                            <h3 className="text-sm font-medium text-text-primary mb-1">No notifications</h3>
                            <p className="text-xs text-text-secondary">
                                {activeTab === "unread"
                                    ? "You're all caught up!"
                                    : "You don't have any notifications right now."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-1">
                            {filteredItems.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => !notification.read && handleToggleRead(notification.id)}
                                    className={`flex items-start gap-3 w-full text-left p-3 rounded-xl transition-colors cursor-pointer ${!notification.read ? "bg-white hover:bg-bg-app" : "bg-white hover:bg-gray-50/50"
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className="shrink-0 mt-0.5 relative">
                                        {!notification.read && (
                                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full z-10" />
                                        )}
                                        {getIconForType(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs sm:text-sm mb-1 leading-snug line-clamp-2 ${!notification.read ? "text-text-primary font-medium" : "text-text-secondary font-normal"}`}>
                                            {notification.title}: {notification.message}
                                        </p>
                                        <span className="text-xs font-medium text-text-secondary flex items-center gap-1.5 mt-2">
                                            <Timer size={14} />{formatTime(notification.date)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
