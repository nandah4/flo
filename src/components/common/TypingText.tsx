"use client";

import { useEffect, useState } from "react";

const TEXT = "Hi, I'm Flo AI 👋 Ready to turn your thoughts into smart, organized notes today?";
const TYPING_SPEED = 45;
const ERASE_SPEED = 25;
const PAUSE_AFTER = 5000;

export function TypingText() {
    const [displayed, setDisplayed] = useState("");
    const [phase, setPhase] = useState<"typing" | "pausing" | "erasing" | "waiting">("typing");

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (phase === "typing") {
            if (displayed.length < TEXT.length) {
                timeout = setTimeout(() => {
                    setDisplayed(TEXT.slice(0, displayed.length + 1));
                }, TYPING_SPEED);
            } else {
                setPhase("pausing");
            }
        }

        if (phase === "pausing") {
            timeout = setTimeout(() => setPhase("erasing"), PAUSE_AFTER);
        }

        if (phase === "erasing") {
            if (displayed.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayed((prev) => prev.slice(0, -1));
                }, ERASE_SPEED);
            } else {
                setPhase("waiting");
            }
        }

        if (phase === "waiting") {
            // brief pause before restarting
            timeout = setTimeout(() => setPhase("typing"), 600);
        }

        return () => clearTimeout(timeout);
    }, [displayed, phase]);

    return (
        <div className="flex flex-col">
            <p className="text-xs sm:text-sm text-text-secondary">
                {displayed}
                <span
                    className="inline-block w-px h-3 ml-0.5 bg-current align-middle animate-[blink_0.7s_step-end_infinite]"
                    aria-hidden="true"
                />
            </p>

            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
        </div>
    );
}