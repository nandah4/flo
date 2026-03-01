import React, { useState } from 'react';
import { FileText, Layers, Pin, Clock, Trash2 } from 'lucide-react';
import type { Note, NoteColor } from '../../pages/Notes';

interface ColorConfig { value: NoteColor; label: string; bg: string; border: string; }

interface NoteCardProps {
    note: Note;
    colorConfig: ColorConfig[];
    colorDot: Record<NoteColor, string>;
    onClick?: () => void;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    onPinToggle?: (id: number) => void;
    onDelete?: (id: number) => void;
    onGenerateFlashcard?: (id: number) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
    note, colorConfig, colorDot, onClick, onDragStart, onPinToggle, onDelete, onGenerateFlashcard
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const c = colorConfig.find(x => x.value === note.color) ?? colorConfig[0];

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        const target = e.currentTarget;
        const clone = target.cloneNode(true) as HTMLDivElement;
        clone.style.cssText = 'position:absolute;top:-1000px;left:-1000px;transform:scale(0.9);';
        const rect = target.getBoundingClientRect();
        clone.style.width = `${rect.width}px`;
        document.body.appendChild(clone);
        e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
        setTimeout(() => document.body.removeChild(clone), 0);
        if (onDragStart) onDragStart(e, note.id);
    };

    // Plain text for preview
    const plainPreview = note.preview.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    return (
        <div
            draggable={!!onDragStart}
            onDragStart={handleDragStart}
            onDragEnd={() => setIsDragging(false)}
            onClick={onClick}
            className={`${c.bg} rounded-xl p-4 border ${c.border} cursor-pointer group transition-all duration-200 relative
                ${isDragging ? 'opacity-40 scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-md'}`}
        >
            {/* Color accent strip */}
            {note.color !== 'default' && (
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${colorDot[note.color].replace('bg-', 'bg-')}`} />
            )}

            {/* Header row */}
            <div className="flex items-start justify-between mb-3 mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center text-gray-400 shrink-0 border border-white">
                    <FileText size={14} strokeWidth={2} />
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Pin button */}
                    {onPinToggle && (
                        <button
                            onClick={e => { e.stopPropagation(); onPinToggle(note.id); }}
                            className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150
                                ${note.pinned ? 'text-secondary bg-primary/10' : 'text-gray-400 hover:bg-white hover:text-secondary'}`}
                            title={note.pinned ? 'Unpin' : 'Pin'}
                        >
                            <Pin size={13} strokeWidth={note.pinned ? 3 : 2} />
                        </button>
                    )}
                    {/* Flashcard button */}
                    {onGenerateFlashcard && (
                        <div className="relative">
                            <button
                                onClick={e => { e.stopPropagation(); onGenerateFlashcard(note.id); }}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-white hover:text-secondary transition-all duration-150 peer"
                            >
                                <Layers size={13} strokeWidth={2} />
                            </button>
                            <div className="absolute bottom-full right-0 mb-1.5 pointer-events-none opacity-0 peer-hover:opacity-100 transition-opacity z-10">
                                <div className="bg-gray-800 text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                                    Generate Flashcard
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Delete button */}
                    {onDelete && (
                        <button
                            onClick={e => { e.stopPropagation(); onDelete(note.id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
                            title="Delete note"
                        >
                            <Trash2 size={13} strokeWidth={2} />
                        </button>
                    )}
                </div>

                {/* Pin indicator when not hovered */}
                {note.pinned && (
                    <Pin size={11} className="text-secondary absolute top-3 right-3 group-hover:hidden" strokeWidth={3} />
                )}
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-gray-800 leading-snug mb-1.5 line-clamp-2">
                {note.title}
            </p>

            {/* Preview */}
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">
                {plainPreview}
            </p>

            {/* Tags */}
            {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/80 text-gray-500 border border-white">
                            {tag}
                        </span>
                    ))}
                    {note.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/80 text-gray-400 border border-white">
                            +{note.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2.5 border-t border-black/5">
                <div className="flex items-center gap-1.5">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-normal">{note.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                    {note.wordCount > 0 && (
                        <span className="text-[10px] text-gray-400">{note.wordCount}w</span>
                    )}
                    {note.color !== 'default' && (
                        <div className={`w-2 h-2 rounded-full ${colorDot[note.color]}`} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
