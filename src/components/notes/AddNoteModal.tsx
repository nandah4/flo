import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlignLeft, Tag, Plus, Check, Palette, BookOpen, Hash } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import type { NoteColor } from '../../pages/Notes';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, preview: string, tags: string[], color: NoteColor, notebook: string) => void;
    initialTitle?: string;
    initialPreview?: string;
    initialTags?: string[];
    initialColor?: NoteColor;
    initialNotebook?: string;
    availableTags: string[];
    notebooks: string[];
}

const COLOR_OPTIONS: { value: NoteColor; dot: string; bg: string }[] = [
    { value: 'default', dot: 'bg-gray-300', bg: 'bg-white border-gray-300' },
    { value: 'yellow', dot: 'bg-amber-400', bg: 'bg-amber-50 border-amber-300' },
    { value: 'blue', dot: 'bg-blue-400', bg: 'bg-blue-50 border-blue-300' },
    { value: 'green', dot: 'bg-emerald-400', bg: 'bg-emerald-50 border-emerald-300' },
    { value: 'red', dot: 'bg-red-400', bg: 'bg-red-50 border-red-300' },
    { value: 'purple', dot: 'bg-purple-400', bg: 'bg-purple-50 border-purple-300' },
];

const countWords = (html: string): number => {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
};

const AddNoteModal: React.FC<AddNoteModalProps> = ({
    isOpen, onClose, onSave,
    initialTitle = '', initialPreview = '',
    initialTags = [], initialColor = 'default', initialNotebook = 'Lectures',
    availableTags, notebooks
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [preview, setPreview] = useState(initialPreview);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [color, setColor] = useState<NoteColor>(initialColor);
    const [notebook, setNotebook] = useState(initialNotebook);

    const [tagSearch, setTagSearch] = useState('');
    const wasOpenRef = useRef(false);

    useEffect(() => {
        // Only reset form when modal transitions from closed → open.
        // Avoids re-running on every render due to unstable array references (initialTags=[]).
        if (isOpen && !wasOpenRef.current) {
            setTitle(initialTitle);
            setPreview(initialPreview);
            setTags(initialTags && initialTags.length ? initialTags : []);
            setColor(initialColor ?? 'default');
            setNotebook(initialNotebook ?? (notebooks[0] || ''));
            setTagSearch('');
        }
        wasOpenRef.current = isOpen;
    }, [isOpen]); // only isOpen — avoids stale-closure reset on every keystroke

    const handleSave = () => {
        if (title.trim() || preview.trim()) {
            onSave(title.trim() || 'Untitled Note', preview, tags, color, notebook);
        }
        onClose();
    };



    const addTag = (tag: string) => {
        if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
        setTagSearch('');
    };
    const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

    const wordCount = countWords(preview);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div key="overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={handleSave}
                    />

                    <motion.div key="drawer"
                        initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className={[
                            'fixed z-50 bg-bg-app shadow-2xl flex flex-col mr-2 my-2',
                            'md:inset-y-0 md:right-0 md:w-[560px] md:rounded-xl',
                            'max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:rounded-xl max-md:max-h-[92vh]',
                        ].join(' ')}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shrink-0">
                            <div>
                                <h3 className="md:text-lg text-base font-medium text-gray-900">
                                    {initialTitle ? 'Edit Note' : 'Add New Note'}
                                </h3>
                                <p className="text-sm text-text-secondary mt-0.5">
                                    {initialTitle ? 'Make changes to your note below.' : 'Fill in the details below to create a note.'}
                                </p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-5 px-6 py-4">

                                {/* Title */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2">
                                        <AlignLeft size={12} /> Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={title} onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Calculus III Notes"
                                        className="w-full text-xs text-gray-700 placeholder:text-gray-300 bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    />
                                </div>

                                {/* Notebook */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2">
                                        <BookOpen size={12} /> Notebook
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {notebooks.map(nb => (
                                            <button key={nb} type="button" onClick={() => setNotebook(nb)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-normal border transition-all
                                                    ${notebook === nb ? 'bg-primary/10 text-secondary border-primary/30' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}
                                            >{nb}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2">
                                        <Hash size={12} /> Tags
                                    </label>

                                    {/* Selected tags */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {tags.map(tag => (
                                                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-secondary text-xs rounded-md font-medium">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Available tags to click */}
                                    {availableTags.filter(t => !tags.includes(t)).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {availableTags.filter(t => !tags.includes(t)).map(t => (
                                                <button type="button" key={t} onClick={() => addTag(t)}
                                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-white text-gray-500 border border-gray-200 hover:border-primary/40 hover:text-secondary transition-colors">
                                                    <Tag size={10} /> {t}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* New tag input */}
                                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                                        <Plus size={12} className="text-gray-400 shrink-0" />
                                        <input
                                            type="text"
                                            value={tagSearch}
                                            onChange={e => setTagSearch(e.target.value)}
                                            placeholder="Type a new tag and press Enter..."
                                            className="flex-1 text-xs text-gray-700 placeholder:text-gray-300 outline-none bg-transparent"
                                            onKeyDown={e => {
                                                if ((e.key === 'Enter' || e.key === ',') && tagSearch.trim()) {
                                                    e.preventDefault();
                                                    addTag(tagSearch.trim().replace(/,$/, ''));
                                                }
                                            }}
                                        />
                                        {tagSearch.trim() && (
                                            <button type="button" onClick={() => addTag(tagSearch.trim())}
                                                className="text-[10px] font-medium text-secondary bg-primary/10 px-2 py-0.5 rounded-md hover:bg-primary/20 transition-colors shrink-0">
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Color picker */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2">
                                        <Palette size={12} /> Color Label
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {COLOR_OPTIONS.map(opt => (
                                            <button key={opt.value} type="button" onClick={() => setColor(opt.value)}
                                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${opt.dot}
                                                    ${color === opt.value ? 'border-gray-600 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                                                title={opt.value}
                                            >
                                                {color === opt.value && <Check size={12} className="text-white drop-shadow-sm" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content label + word count */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-text-primary tracking-wider flex items-center gap-2">
                                        <AlignLeft size={12} /> Content
                                    </label>
                                    {wordCount > 0 && (
                                        <span className="text-[11px] text-gray-400 font-medium">{wordCount} words</span>
                                    )}
                                </div>
                            </div>

                            {/* Rich text editor */}
                            <div className="flex-1 px-6 pb-4 min-h-[180px]">
                                <RichTextEditor content={preview} onChange={setPreview} placeholder="Start writing your note..." />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto px-6 py-5 border-t border-gray-100 flex items-center gap-3 shrink-0">
                            <button type="button" onClick={onClose}
                                className="flex-1 py-2.5 rounded-md border border-gray-200 text-sm font-normal text-gray-500 bg-white hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSave}
                                className="flex-1 py-2.5 rounded-md bg-linear-to-t from-primary to-primary/80 text-text-primary text-sm font-normal hover:opacity-90 transition-opacity">
                                {initialTitle ? 'Save Changes' : 'Add Note'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default AddNoteModal;
