import React from 'react';
import iconAIAssistant from "../../assets/images/icon-ai-assistant.png";
import icVideo from "../../assets/videos/ic.mov";

interface FloatingAIButtonProps {
    onClick?: () => void;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-24 sm:bottom-8 cursor-pointer right-8 w-14 h-14 rounded-full bg-white border shadow-xl shadow-secondary/20 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 z-40 border-secondary p-1!"
            aria-label="AI Assistant"
        >
            <div className="relative w-full h-full overflow-hidden rounded-full">
                {/* AI icon */}
                <img
                    src={iconAIAssistant}
                    alt="AI Assistant"
                    draggable={false}
                    className="h-full w-full relative z-0"
                />

                {/* Blinking overlay video */}
                <video
                    src={icVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none mix-blend-screen"
                />
            </div>
        </button>
    );
};

export default FloatingAIButton;
