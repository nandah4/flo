import React, { useState } from 'react';
import { Layers, Pin, Trash2, Tag, Clock } from 'lucide-react';
import type { Note, NoteColor, Label } from '../../pages/Notes';

const LABEL_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', dot: 'bg-rose-400' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', dot: 'bg-pink-400' },
    fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', dot: 'bg-fuchsia-400' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-600', dot: 'bg-violet-400' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-400' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-600', dot: 'bg-sky-400' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', dot: 'bg-cyan-400' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600', dot: 'bg-teal-400' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-400' },
    green: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-400' },
    lime: { bg: 'bg-lime-100', text: 'text-lime-600', dot: 'bg-lime-400' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-400' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', dot: 'bg-orange-400' },
};
const getLabelStyle = (color: string) =>
    LABEL_STYLE[color] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };

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
            className={`bg-white rounded-lg p-4 border border-gray-200 cursor-pointer group transition-all duration-200 relative
                ${isDragging ? 'opacity-40 scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-md'}`}
        >

            {/* Header row */}
            <div className="flex items-start justify-end mb-3 mt-0.5">

                <div className="flex items-center gap-2">
                    {/* Pin button */}
                    {onPinToggle && (
                        <button
                            onClick={e => { e.stopPropagation(); onPinToggle(note.id); }}
                            className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150
                                ${note.pinned ? 'text-secondary bg-primary/10' : 'text-gray-400 hover:bg-white hover:text-secondary'}`}
                            title={note.pinned ? 'Unpin' : 'Pin'}
                        >
                            <Pin size={14} strokeWidth={note.pinned ? 3 : 2} />
                        </button>
                    )}
                    {/* Flashcard button */}
                    {onGenerateFlashcard && (
                        <div className="relative">
                            <button
                                onClick={e => { e.stopPropagation(); onGenerateFlashcard(note.id); }}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-white hover:text-secondary transition-all duration-150 peer"
                            >
                                <Layers size={14} strokeWidth={2} />
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
                            <Trash2 size={14} strokeWidth={2} />
                        </button>
                    )}
                </div>


            </div>

            {/* Labels */}
            {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.slice(0, 3).map((label: Label) => {
                        const s = getLabelStyle(label.color);
                        return (
                            <span key={label.text}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-normal ${s.bg} ${s.text}`}>
                                <Tag size={13} />
                                {label.text}
                            </span>
                        );
                    })}
                    {note.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-400">
                            +{note.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Title */}
            <p className="text-base font-medium text-text-primary mb-1.5 line-clamp-2">
                {note.title}
            </p>

            {/* Preview */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                {plainPreview}
            </p>



            {/* Footer */}
            <div className="flex items-center justify-between pt-2.5">
                <p className="text-xs text-text-secondary">
                    Last Edited
                </p>
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-text-secondary" />
                    <span className="text-xs text-text-secondary font-normal">{note.timestamp}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                    {note.wordCount > 0 && (
                        <span className="text-[14px] text-text-secondary">{note.wordCount}w</span>
                    )}
                    {note.color !== 'default' && (
                        <div className={`w-2 h-2 rounded-full ${colorDot[note.color]}`} />
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default NoteCard;
