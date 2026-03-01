import { useState } from 'react';
import { FileText, Layers, Clock } from 'lucide-react';

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
        const target = e.currentTarget;
        const dragImage = target.cloneNode(true) as HTMLDivElement;
        dragImage.style.transform = 'scale(0.9)';
        dragImage.style.transformOrigin = 'center';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        dragImage.style.left = '-1000px';
        const rect = target.getBoundingClientRect();
        dragImage.style.width = `${rect.width}px`;
        dragImage.style.height = `${rect.height}px`;
        dragImage.style.zIndex = '-1';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, rect.width / 2, rect.height / 2);
        setTimeout(() => document.body.removeChild(dragImage), 0);
        if (onDragStart) onDragStart(e, id);
    };

    const handleDragEnd = () => setIsDragging(false);

    // Strip HTML tags for plain text preview
    const plainPreview = preview.replace(/<[^>]+>/g, '');

    return (
        <div
            draggable={!!onDragStart}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={onClick}
            className={`bg-white rounded-xl p-4 border border-gray-200 cursor-pointer group transition-all duration-200
                ${isDragging ? 'opacity-40 shadow-none scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-md'}`}
        >
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-secondary shrink-0">
                    <FileText size={15} strokeWidth={2} />
                </div>

                {onGenerateFlashcard && (
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); onGenerateFlashcard(id); }}
                            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 hover:text-secondary transition-all duration-200 peer"
                        >
                            <Layers size={14} strokeWidth={2} />
                        </button>
                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-1.5 pointer-events-none opacity-0 peer-hover:opacity-100 transition-opacity duration-150 z-10">
                            <div className="bg-gray-800 text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                                Generate Flashcard
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-gray-800 leading-snug mb-2 line-clamp-2">
                {title}
            </p>

            {/* Preview */}
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-4">
                {plainPreview}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-text-secondary" />
                    <span className="text-[11px] text-text-secondary font-normal">{timestamp}</span>
                </div>
                {category && (
                    <span className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-secondary">
                        {category}
                    </span>
                )}
            </div>
        </div>
    );
};

export default NoteCard;


