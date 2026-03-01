import { useState } from 'react';
import { FileText, Layers } from 'lucide-react';

interface NoteCardProps {
    id: number;
    title: string;
    preview: string;
    timestamp: string;
    category?: string;
    onClick?: () => void;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    onGenerateFlashcard?: (id: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
    id,
    title,
    preview,
    timestamp,
    category,
    onClick,
    onDragStart,
    onGenerateFlashcard,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);

        // Create a custom drag image that is scaled down
        const target = e.currentTarget;
        const dragImage = target.cloneNode(true) as HTMLDivElement;
        dragImage.style.transform = 'scale(0.85)';
        dragImage.style.transformOrigin = 'center';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        dragImage.style.left = '-1000px';
        const rect = target.getBoundingClientRect();
        dragImage.style.width = `${rect.width}px`;
        dragImage.style.height = `${rect.height}px`;
        dragImage.style.zIndex = '-1';
        document.body.appendChild(dragImage);

        // Set the custom drag image
        e.dataTransfer.setDragImage(dragImage, rect.width / 2, rect.height / 2);

        // Clean up the temporary node
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);

        if (onDragStart) {
            onDragStart(e, id);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            draggable={!!onDragStart}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={onClick}
            className={`bg-white rounded-[2.5rem] p-8 h-[280px] flex flex-col justify-between group transition-all duration-500 cursor-pointer border border-slate-100/60
                ${isDragging
                    ? 'opacity-40 shadow-none scale-[0.98]'
                    : 'hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-slate-200'
                }`}
        >
            <div className="flex justify-between items-start mb-5">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-primary/10 group-hover:text-secondary transition-colors duration-500">
                    <FileText size={22} strokeWidth={2} />
                </div>
                {onGenerateFlashcard && (
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); onGenerateFlashcard(id); }}
                            className="opacity-0 group-hover:opacity-100 bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-secondary p-2.5 rounded-2xl transition-all duration-300 peer"
                        >
                            <Layers size={16} strokeWidth={2} />
                        </button>
                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-10">
                            <div className="bg-slate-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                                Generate Flashcard
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-2 flex-1 relative overflow-hidden flex flex-col">
                <h3 className="font-bold text-lg text-text-primary leading-tight mb-2 group-hover:text-secondary transition-colors duration-300 line-clamp-1 tracking-tight flex-shrink-0">
                    {title}
                </h3>
                <div
                    className="text-slate-500 text-[14px] leading-relaxed opacity-90 font-medium overflow-hidden
                    [&>p]:mb-1 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-1 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-1"
                    dangerouslySetInnerHTML={{ __html: preview }}
                />
                {/* Fade out gradient at the bottom to handle overflow gracefully */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50/80 flex items-center justify-between flex-shrink-0">
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-slate-400">
                    {timestamp}
                </span>
                {category && (
                    <span className="text-[11px] font-bold px-3.5 py-1.5 bg-slate-50 text-slate-500 rounded-full border border-slate-100 max-w-[120px] truncate transition-colors duration-300 group-hover:bg-primary group-hover:text-text-primary group-hover:border-primary/20">
                        {category}
                    </span>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
