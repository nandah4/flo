import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Tag, Sparkles, Loader2, Paperclip, Mic } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import type { NoteColor, Label } from '../../pages/Notes';

import aiAssistant from '../../assets/images/icon-ai-assistant.png';

const LABEL_COLORS = [
    'rose', 'pink', 'fuchsia', 'violet', 'indigo',
    'sky', 'cyan', 'teal', 'emerald', 'green',
    'lime', 'amber', 'orange'
];

const getRandomLabelColor = () =>
    LABEL_COLORS[Math.floor(Math.random() * LABEL_COLORS.length)];

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

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, preview: string, tags: Label[], color: NoteColor, notebook: string) => void;
    initialTitle?: string;
    initialPreview?: string;
    initialTags?: Label[];
    initialColor?: NoteColor;
    initialNotebook?: string;
    documentUrl?: string;
    audioUploaded?: boolean;   // if true, show waveform below upload icons
    audioFileName?: string;    // filename of uploaded audio for waveform label
    availableTags: Label[];
    notebooks: string[];
}



const countWords = (html: string): number => {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
};

const AddNoteModal: React.FC<AddNoteModalProps> = ({
    isOpen, onClose, onSave,
    initialTitle = '', initialPreview = '',
    initialTags = [], initialColor = 'default', initialNotebook = 'Lectures',
    documentUrl, audioUploaded = false, audioFileName,
    availableTags, notebooks
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [preview, setPreview] = useState(initialPreview);
    const [tags, setTags] = useState<Label[]>(initialTags ?? []);
    const [notebook, setNotebook] = useState(initialNotebook);

    const [tagSearch, setTagSearch] = useState('');
    const wasOpenRef = useRef(false);

    useEffect(() => {
        // Only reset form when modal transitions from closed → open.
        if (isOpen && !wasOpenRef.current) {
            setTitle(initialTitle);
            setPreview(initialPreview);
            setTags(initialTags && initialTags.length ? initialTags : []);
            setNotebook(initialNotebook ?? (notebooks[0] || ''));
            setTagSearch('');
        }
        wasOpenRef.current = isOpen;
    }, [isOpen]); // only isOpen — avoids stale-closure reset on every keystroke

    const handleSave = () => {
        if (title.trim() || preview.trim()) {
            onSave(title.trim() || 'Untitled Note', preview, tags, initialColor, notebook);
        }
        onClose();
    };



    const addTag = (text: string) => {
        if (!tags.some(t => t.text === text)) {
            setTags(prev => [...prev, { text: text.trim(), color: getRandomLabelColor() }]);
        }
        setTagSearch('');
    };
    const removeTag = (text: string) => setTags(prev => prev.filter(t => t.text !== text));

    const [isPolishing, setIsPolishing] = useState(false);

    // Internal upload state (from buttons inside the drawer)
    const [internalDocUrl, setInternalDocUrl] = useState<string | null>(null);
    const [internalAudioFile, setInternalAudioFile] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const docInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    // Effective values = prop-supplied (from Notes.tsx) or internally uploaded
    const effectiveDocUrl = documentUrl || internalDocUrl;
    const effectiveAudioFile = audioFileName || internalAudioFile || undefined;
    const effectiveAudioUploaded = audioUploaded || !!internalAudioFile;

    // Reset internal upload state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setInternalDocUrl(null);
            setInternalAudioFile(null);
            setIsUploading(false);
        }
    }, [isOpen]);

    const handleInternalDocUpload = (file: File) => {
        setIsUploading(true);
        setTimeout(() => {
            const name = file.name.replace(/\.[^/.]+$/, '');
            setTitle(prev => prev || `Summary: ${name}`);
            setPreview(prev => prev || `<p>AI generated summary for <strong>${file.name}</strong>. The document covers fundamental concepts and key takeaways. This summary highlights the core ideas and provides a structured overview of the material.</p>`);
            setTags(prev => prev.length ? prev : [{ text: 'AI Summary', color: 'amber' }]);
            setInternalDocUrl('/dummy_doc.pdf'); // replace dummyPdf import with dummy path string for preview
            setIsUploading(false);
        }, 1400);
    };

    const handleInternalAudioUpload = (file: File) => {
        setIsUploading(true);
        setTimeout(() => {
            const name = file.name.replace(/\.[^/.]+$/, '');
            setTitle(prev => prev || `Voice Note: ${name}`);
            setPreview(prev => prev || `<p>AI transcription of <strong>${file.name}</strong>. The recording has been analyzed and key points extracted into this structured note.</p>`);
            setTags(prev => prev.length ? prev : [{ text: 'Voice Note', color: 'sky' }, { text: 'AI Summary', color: 'amber' }]);
            setInternalAudioFile(file.name);
            setIsUploading(false);
        }, 1400);
    };

    const handlePolish = async () => {
        if (!preview.trim() || isPolishing) return;

        setIsPolishing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsPolishing(false);
    };

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
                            effectiveDocUrl ? 'md:inset-y-0 md:right-0 md:w-[940px] xl:w-[1040px] md:rounded-xl' : 'md:inset-y-0 md:right-0 md:w-[560px] md:rounded-xl',
                            'max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:rounded-xl max-md:max-h-[92vh]',
                        ].join(' ')}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 shrink-0">
                            <div>
                                <h3 className="md:text-lg text-base font-medium text-text-primary">
                                    {initialTitle ? 'Edit Note' : 'Add New Note'}
                                </h3>
                                <p className="text-sm text-text-secondary mt-0.5">Fill in the details below to create a note.</p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body (Split view or Single form) */}
                        <div className={`flex flex-1 overflow-hidden ${effectiveDocUrl ? 'flex-col md:flex-row gap-2' : 'flex-col'}`}>

                            {/* Left Pane: Document Overview */}
                            {effectiveDocUrl && (
                                <div className="flex flex-col h-56 md:h-auto md:flex-1 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 px-4 md:pl-6 pt-4 md:pt-0 shrink-0">
                                    <div className="flex items-center justify-between mb-2 md:mb-3">
                                        <h4 className="text-sm font-medium text-text-primary">Overview Document</h4>
                                        <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">PDF</span>
                                    </div>
                                    <div className="flex-1 min-h-[140px] md:min-h-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4 md:mb-0">
                                        <object data={effectiveDocUrl} type="application/pdf" className="w-full h-full" title="Document Preview" />
                                    </div>
                                </div>
                            )}

                            {/* Right Pane: Scrollable Form */}
                            <div className={`flex flex-col overflow-y-auto ${effectiveDocUrl ? 'md:w-[460px] shrink-0' : 'flex-1'}`}>
                                <div className="flex flex-col gap-5 px-6 py-2">

                                    {/* Attachment Section */}
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-medium text-text-primary">Attach Resource</p>
                                        <div className="flex items-center gap-2">
                                            {/* Hidden file inputs */}
                                            <input ref={docInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt"
                                                onChange={e => { const f = e.target.files?.[0]; if (f) { handleInternalDocUpload(f); if (docInputRef.current) docInputRef.current.value = ''; } }}
                                            />
                                            <input ref={audioInputRef} type="file" className="hidden" accept="audio/*,.mp3,.wav,.m4a,.ogg"
                                                onChange={e => { const f = e.target.files?.[0]; if (f) { handleInternalAudioUpload(f); if (audioInputRef.current) audioInputRef.current.value = ''; } }}
                                            />
                                            <button type="button"
                                                onClick={() => docInputRef.current?.click()}
                                                disabled={isUploading}
                                                className={`flex items-center gap-1.5 px-2.5 py-2.5 rounded-md border text-xs font-normal bg-white transition-colors
                                                    ${effectiveDocUrl ? 'border-secondary/40 text-secondary' : 'border-gray-200 text-text-secondary hover:text-text-primary'} disabled:opacity-50`}
                                            >
                                                {isUploading && !effectiveAudioFile ? <Loader2 size={13} className="animate-spin" /> : <Paperclip size={14} />}
                                                <span>{effectiveDocUrl ? 'Document attached' : 'Document'}</span>
                                            </button>
                                            <button type="button"
                                                onClick={() => audioInputRef.current?.click()}
                                                disabled={isUploading}
                                                className={`flex items-center gap-1.5 px-2.5 py-2.5 rounded-md border text-xs font-normal bg-white transition-colors
                                                    ${effectiveAudioUploaded ? 'border-secondary/40 text-secondary' : 'border-gray-200 text-text-secondary hover:text-text-primary'} disabled:opacity-50`}
                                            >
                                                {isUploading && effectiveAudioFile ? <Loader2 size={13} className="animate-spin" /> : <Mic size={14} />}
                                                <span>{effectiveAudioUploaded ? 'Voice attached' : 'Voice Note'}</span>
                                            </button>
                                        </div>

                                        {/* Waveform — only visible after audio upload */}
                                        {effectiveAudioUploaded && (
                                            <div className="flex flex-col gap-1.5 bg-white border border-gray-200 rounded-xl px-4 py-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mic size={14} className="text-secondary" />
                                                        <span className="text-xs font-medium text-text-primary truncate max-w-[200px]">{effectiveAudioFile ?? 'Voice Note'}</span>
                                                    </div>
                                                    <span className="text-xs text-secondary font-medium">AI Transcribed</span>
                                                </div>
                                                <div className="flex items-end gap-[3px] h-8">
                                                    {[4, 12, 7, 16, 9, 20, 6, 14, 18, 8, 22, 11, 16, 7, 20, 9, 13, 6, 18, 10, 15, 8, 12, 19, 7, 14, 10, 17, 9, 22, 6, 15, 11, 18, 8].map((h, i) => (
                                                        <div key={i}
                                                            style={{ height: `${h}px`, animationDelay: `${i * 55}ms` }}
                                                            className="flex-1 min-w-0 rounded-full bg-secondary/50 animate-pulse"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="flex flex-col gap-y-1.5">
                                        <label className="text-sm font-medium text-text-primary">
                                            Title
                                        </label>
                                        <input
                                            value={title} onChange={e => setTitle(e.target.value)}
                                            placeholder="e.g. Calculus III Notes"
                                            className="w-full text-sm text-gray-700 placeholder:text-text-secondary bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-primary/10 transition-all"
                                        />
                                    </div>

                                    {/* Notes with editor */}
                                    <div className={`flex flex-col -mt-3 ${preview.trim() ? 'mb-6.5 sm:mb-3.5' : 'mb-0'}`}>
                                        <div className="relative h-[250px]! w-full">
                                            <RichTextEditor content={preview} onChange={setPreview} placeholder="Start writing your note..." />
                                            {preview.trim() && (
                                                <p className="text-xs font-medium text-text-secondary mt-2 flex items-center gap-1.5">
                                                    <Sparkles size={12} className="text-secondary" />
                                                    With Polish, Let FloAI refine and structure your notes instantly.
                                                </p>
                                            )}

                                            {/* AI Polish button */}
                                            {preview.trim() && (
                                                <button
                                                    type="button"
                                                    onClick={handlePolish}
                                                    disabled={isPolishing}
                                                    title="Polish with FLoAI"
                                                    className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white border border-gray-200 shadow-sm text-[11px] font-medium text-text-secondary hover:text-secondary hover:border-primary/40 hover:shadow transition-all disabled:opacity-60"
                                                >
                                                    {isPolishing
                                                        ? <Loader2 size={13} className="animate-spin text-secondary" />
                                                        : <img src={aiAssistant} className='w-4 h-4' alt="AI" />
                                                    }
                                                    {isPolishing ? 'Polishing...' : 'Polish'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notebook */}
                                    <div className="flex flex-col gap-y-1.5">
                                        <label className="text-sm font-medium text-text-primary">
                                            Notespace
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {notebooks.map(nb => (
                                                <button key={nb} type="button" onClick={() => setNotebook(nb)}
                                                    className={`px-3.5 py-2 rounded-md text-xs font-normal border transition-all
                                                    ${notebook === nb ? 'bg-primary/20 text-secondary border-primary/30' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}
                                                >{nb}</button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-col gap-y-1.5">
                                        <label className="text-sm font-medium text-text-primary">
                                            Labels
                                        </label>

                                        {/* Selected labels */}
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {tags.map(label => {
                                                    const s = getLabelStyle(label.color);
                                                    return (
                                                        <span key={label.text}
                                                            className={`flex items-center gap-1.5 px-2 py-1 ${s.bg} ${s.text} text-xs rounded-md font-normal`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
                                                            {label.text}
                                                            <button type="button" onClick={() => removeTag(label.text)}
                                                                className="hover:opacity-60 transition-opacity ml-0.5">
                                                                <X size={10} />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Available labels to re-apply */}
                                        {availableTags.filter(l => !tags.some(t => t.text === l.text)).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {availableTags.filter(l => !tags.some(t => t.text === l.text)).map(l => {
                                                    const s = getLabelStyle(l.color);
                                                    return (
                                                        <button type="button" key={l.text}
                                                            onClick={() => setTags(prev => [...prev, l])}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs ${s.bg} ${s.text} border border-transparent hover:border-current/20 transition-colors`}>
                                                            <Tag size={12} />
                                                            {l.text}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* New label input */}
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                                            <Plus size={14} className="text-gray-400 shrink-0" />
                                            <input
                                                type="text"
                                                value={tagSearch}
                                                onChange={e => setTagSearch(e.target.value)}
                                                placeholder="Add a label and press Enter..."
                                                className="flex-1 text-xs text-gray-700 placeholder:text-text-secondary outline-none bg-transparent"
                                                onKeyDown={e => {
                                                    if ((e.key === 'Enter' || e.key === ',') && tagSearch.trim()) {
                                                        e.preventDefault();
                                                        addTag(tagSearch.trim().replace(/,$/, ''));
                                                    }
                                                }}
                                            />
                                            {tagSearch.trim() && (
                                                <button type="button" onClick={() => addTag(tagSearch.trim())}
                                                    className="text-xs font-normal text-secondary bg-primary/20 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors shrink-0">
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button type="button" onClick={onClose}
                                className="px-5 py-2.5 cursor-pointer rounded-md border border-gray-200 text-sm font-normal text-gray-500 bg-white hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSave}
                                className="px-5 py-2.5 cursor-pointer rounded-md bg-linear-to-t from-primary to-primary/80 text-text-primary text-sm font-normal hover:opacity-90 transition-opacity">
                                {initialTitle ? 'Save Changes' : 'Add Note'}
                            </button>
                        </div>


                    </motion.div>
                </>
            )}
        </AnimatePresence >,
        document.body
    );
};

export default AddNoteModal;
