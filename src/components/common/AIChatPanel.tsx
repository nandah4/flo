import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Send, Sparkles, Bot } from 'lucide-react';

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: string;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi there! I'm your Flo AI Assistant. I can help you summarize your notes, draft study materials, or answer questions about your documents.",
            isUser: false,
            timestamp: "Just now"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    if (!isOpen) return null;

    const handleSend = () => {
        if (!input.trim()) return;

        const newUserMsg: Message = {
            id: Date.now(),
            text: input,
            isUser: true,
            timestamp: "Just now"
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const newAiMsg: Message = {
                id: Date.now() + 1,
                text: "That's an interesting point! I've noted that down. Do you need me to summarize any recent notes for you?",
                isUser: false,
                timestamp: "Just now"
            };
            setMessages(prev => [...prev, newAiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Floating pop-up panel */}
            <div className="fixed bottom-28 right-8 z-50 w-[360px] h-[550px] max-h-[70vh] bg-white shadow-2xl border border-slate-100 flex flex-col rounded-3xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-tr from-secondary to-primary p-2 rounded-xl text-white shadow-sm">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-primary leading-tight">Flo AI</h2>
                            <span className="text-[11px] font-semibold text-secondary flex items-center space-x-1">
                                <Sparkles size={10} />
                                <span>Ready to assist</span>
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-text-primary hover:bg-slate-100 p-2 rounded-full transition-colors"
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${msg.isUser
                                ? 'bg-text-primary text-white rounded-br-sm'
                                : 'bg-white border border-slate-100 text-text-primary rounded-bl-sm'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] bg-white border border-slate-100 text-text-primary rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="relative flex items-end bg-slate-50 border border-slate-200 rounded-3xl p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask AI a question..."
                            className="w-full max-h-[120px] bg-transparent resize-none overflow-y-auto px-4 py-2.5 text-sm outline-none text-text-primary placeholder:text-slate-400"
                            rows={1}
                        />
                        <button
                            disabled={!input.trim()}
                            onClick={handleSend}
                            className="flex-shrink-0 bg-primary text-text-primary p-2.5 rounded-full hover:bg-secondary hover:text-white disabled:opacity-50 disabled:hover:bg-primary disabled:hover:text-text-primary transition-colors shadow-sm ml-2"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFO.</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AIChatPanel;
