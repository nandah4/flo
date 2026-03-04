import React, { useState } from 'react';
import { X, Search, Mic, FileText, ListTodo, Clock, Sparkles, ChevronRight } from 'lucide-react';
import iconAIAssistant from '../../assets/images/icon-ai-assistant.png';

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SUGGESTIONS = [
    { icon: <Sparkles size={14} />, label: 'Review Notes' },
    { icon: <ListTodo size={14} />, label: 'Discuss Ideas' },
    { icon: <Clock size={14} />, label: 'Workflow Feedback' },
    { icon: <FileText size={14} />, label: 'Prioritize Tasks' },
];

const CONTEXT_SOURCES = [
    { icon: <FileText size={14} />, label: 'Notes', count: 3 },
    { icon: <ListTodo size={14} />, label: 'Tasks', count: 2 },
    { icon: <Clock size={14} />, label: 'Timer', count: null },
];

const AIChatPanel: React.FC<AIChatPanelProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [activeContext, setActiveContext] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleContext = (label: string) => {
        setActiveContext(prev =>
            prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // handle send
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Panel — same sizing as Add Task drawer: mr-2 my-2, right-side */}
            <div className="fixed z-50 bg-bg-app shadow-2xl flex flex-col mr-2 my-2 md:top-0 md:bottom-0 md:right-0 md:left-auto md:w-[470px] md:rounded-xl max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:rounded-xl max-md:max-h-[90vh] overflow-hidden">

                {/* Close button */}
                <div className="flex justify-end px-5 pt-5">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 flex flex-col overflow-y-auto">

                    {/* Hero section */}
                    <div className="flex flex-col items-center gap-3 px-6 pt-2 pb-6">
                        {/* Logo */}
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                            <img src={iconAIAssistant} alt="Flo AI" className="w-full h-full object-contain" />
                        </div>

                        {/* Greeting */}
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-text-primary">Hi, Wandi Der 👋</h2>
                            <p className="text-lg font-medium text-text-primary mt-0.5">How can I help you today?</p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-secondary text-center max-w-[300px] leading-relaxed">
                            I’m here to help you think clearly, review your tasks, and improve your notes — so you can stay focused and organized.
                        </p>
                    </div>

                    {/* What I can do */}
                    <div className="px-5 pb-5">
                        <p className="text-sm font-medium text-text-primary mb-3">What I can do</p>
                        <div className="grid grid-cols-2 gap-2">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(s.label)}
                                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-white border border-gray-200 text-left text-xs font-normal text-text-secondary hover:border-primary/40 hover:bg-primary/5 hover:text-text-primary transition-all group"
                                >
                                    <span className="text-secondary group-hover:scale-110 transition-transform">{s.icon}</span>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom section — fixed to bottom */}
                <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-100 pt-4 bg-bg-app">

                    {/* Input */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3.5 py-3 focus-within:border-secondary/80 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Flo AI anything..."
                            className="flex-1 text-sm text-text-primary placeholder:text-text-secondary outline-none bg-transparent"
                        />
                        <button className="text-gray-400 hover:text-secondary transition-colors shrink-0">
                            <Mic size={16} />
                        </button>
                    </div>

                    {/* Context sources */}
                    <div>
                        <p className="text-xs font-medium text-text-secondary mb-2">Add context from</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            {CONTEXT_SOURCES.map(src => {
                                const isActive = activeContext.includes(src.label);
                                return (
                                    <button
                                        key={src.label}
                                        onClick={() => toggleContext(src.label)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isActive
                                            ? 'bg-primary/10 border-primary/30 text-secondary'
                                            : 'bg-white border-gray-200 text-text-secondary hover:border-gray-300'
                                            }`}
                                    >
                                        <span>{src.icon}</span>
                                        {src.label}
                                        {src.count !== null && (
                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary/20 text-secondary' : 'bg-gray-100 text-gray-400'}`}>
                                                {src.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}

                            <button className="flex items-center gap-1 text-xs text-text-primary hover:text-text-secondary transition-colors ml-auto">
                                More <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AIChatPanel;
