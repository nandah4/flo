/**
 * QuestContext — shared quest/XP state across the whole app.
 * Components call `progressQuest(id)` to auto-advance quest progress.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type QuestId = 'note' | 'task' | 'ai' | 'flashcard' | 'pomodoro';

export interface Quest {
    id: QuestId;
    label: string;
    description: string;
    xpReward: number;
    target: number;
    progress: number;
    done: boolean;
}

interface QuestState {
    xp: number;
    quests: Quest[];
    progressQuest: (id: QuestId) => void;
    lastXpGain: number | null;
}

const INITIAL_QUESTS: Quest[] = [
    { id: 'note', label: 'Take a Note', description: 'Create a note today', xpReward: 50, target: 1, progress: 0, done: false },
    { id: 'task', label: 'Complete 2 Tasks', description: 'Move 2 tasks to Done', xpReward: 75, target: 2, progress: 0, done: false },
    { id: 'ai', label: 'Generate with FloAI', description: 'Use FloAI to generate a note', xpReward: 40, target: 1, progress: 0, done: false },
    { id: 'flashcard', label: 'Review Flashcards', description: 'Generate flashcards from a note', xpReward: 50, target: 1, progress: 0, done: false },
    { id: 'pomodoro', label: 'Focus Session', description: 'Complete a 25-min Pomodoro session', xpReward: 60, target: 1, progress: 0, done: false },
];

const QuestCtx = createContext<QuestState | null>(null);

export function QuestProvider({ children }: { children: ReactNode }) {
    const [xp, setXp] = useState(340);
    const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
    const [lastXpGain, setLastXpGain] = useState<number | null>(null);

    const progressQuest = useCallback((id: QuestId) => {
        setQuests(prev => prev.map(q => {
            if (q.id !== id || q.done) return q;
            const newProgress = Math.min(q.progress + 1, q.target);
            const isDone = newProgress >= q.target;
            if (isDone) {
                setXp(cur => cur + q.xpReward);
                setLastXpGain(q.xpReward);
                setTimeout(() => setLastXpGain(null), 2000);
            }
            return { ...q, progress: newProgress, done: isDone };
        }));
    }, []);

    return (
        <QuestCtx.Provider value={{ xp, quests, progressQuest, lastXpGain }}>
            {children}
        </QuestCtx.Provider>
    );
}

export function useQuest() {
    const ctx = useContext(QuestCtx);
    if (!ctx) throw new Error('useQuest must be used inside QuestProvider');
    return ctx;
}
