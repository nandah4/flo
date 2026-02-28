import React from 'react';
import { BotMessageSquare } from 'lucide-react';

interface FloatingAIButtonProps {
    onClick?: () => void;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-tr from-secondary to-primary shadow-xl shadow-secondary/30 text-white flex items-center justify-center hover:scale-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 z-40 group border border-white/20"
            aria-label="AI Assistant"
        >
            <BotMessageSquare size={26} className="group-hover:animate-pulse" />
        </button>
    );
};

export default FloatingAIButton;
