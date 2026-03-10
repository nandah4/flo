import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Tag, Sparkles, Loader2, Paperclip, Mic, BookOpen } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import type { NoteColor, Label } from '../../pages/Notes';
import aiAssistant from '../../assets/images/icon-ai-assistant.png';
import dummyPdf from '../../assets/docs/dummy_doc.pdf';

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
    audioUploaded?: boolean;
    audioFileName?: string;
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
    const [openMeta, setOpenMeta] = useState<'notebook' | 'labels' | null>(null);
    const wasOpenRef = useRef(false);

    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            setTitle(initialTitle);
            setPreview(initialPreview);
            setTags(initialTags && initialTags.length ? initialTags : []);
            setNotebook(initialNotebook ?? (notebooks[0] || ''));
            setTagSearch('');
            setOpenMeta(null);
        }
        wasOpenRef.current = isOpen;
    }, [isOpen]);

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

    // Internal upload state
    const [internalDocUrl, setInternalDocUrl] = useState<string | null>(null);
    const [internalAudioFile, setInternalAudioFile] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const docInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const effectiveDocUrl = documentUrl || internalDocUrl;
    const effectiveAudioFile = audioFileName || internalAudioFile || undefined;
    const effectiveAudioUploaded = audioUploaded || !!internalAudioFile;

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
            setPreview(prev => prev || `<p>AI generated summary for <strong>${file.name}</strong>. The document covers fundamental concepts and key takeaways.</p>`);
            setTags(prev => prev.length ? prev : [{ text: 'AI Summary', color: 'amber' }]);
            setInternalDocUrl(dummyPdf);
            setIsUploading(false);
        }, 1400);
    };

    const handleInternalAudioUpload = (file: File) => {
        setIsUploading(true);
        setTimeout(() => {
            const name = file.name.replace(/\.[^/.]+$/, '');
            setTitle(prev => prev || `Voice Note: ${name}`);
            setPreview(prev => prev || `<p>AI transcription of <strong>${file.name}</strong>. Key points have been extracted into this structured note.</p>`);
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
                        className="fixed inset-0 bg-black/60 z-50"
                        onClick={handleSave}
                    />

                    <motion.div key="drawer"
                        initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className={[
                            'fixed z-50 bg-bg-app shadow-2xl flex flex-col rounded-lg overflow-hidden sm:rounded-none',
                            effectiveDocUrl
                                ? 'md:inset-y-0 md:right-0 md:w-[940px] xl:w-[1040px] 2xl:w-[1200px]'
                                : 'md:inset-y-0 md:right-0 md:w-[560px] 2xl:w-[680px]',
                            'max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:max-h-[82vh]',
                        ].join(' ')}
                    >
                        {/* Header — matches Add Task drawer style */}
                        <div className="flex items-center justify-start border-b border-gray-200 shrink-0">
                            <button
                                onClick={onClose}
                                className="p-3.5 2xl:p-4 flex items-center border-r border-gray-200 justify-center text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <span className="text-sm 2xl:text-base font-medium text-text-primary pl-3 2xl:pl-4">
                                {initialTitle ? 'Edit Note' : 'New Note'}
                            </span>
                        </div>

                        {/* Body — split view if doc attached */}
                        <div className={`flex flex-1 overflow-hidden ${effectiveDocUrl ? 'flex-col md:flex-row' : 'flex-col'}`}>

                            {/* Left Pane: Document preview */}
                            {effectiveDocUrl && (
                                <div className="flex flex-col md:w-[450px] shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 px-4 pt-4 pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-text-primary">Overview Document</h4>
                                        <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">PDF</span>
                                    </div>
                                    <div className="flex-1 min-h-[160px] md:min-h-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                        <object data={effectiveDocUrl} type="application/pdf" className="w-full h-full" title="Document Preview" />
                                    </div>
                                </div>
                            )}

                            {/* Right Pane: Form */}
                            <div className={`flex flex-col overflow-y-auto flex-1`}>
                                <div className="flex flex-col gap-2 px-5 2xl:px-7 py-4 2xl:py-5">

                                    {/* Title — Notion-style */}
                                    <input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Note title..."
                                        className="w-full sm:text-xl 2xl:text-2xl text-lg font-medium text-text-primary placeholder:text-text-secondary bg-transparent outline-none border-none px-0 py-1 2xl:py-1.5"
                                    />

                                    {/* Metadata rows */}
                                    <div className="flex flex-col gap-2 2xl:gap-3">

                                        {/* Notespace */}
                                        <div className="flex items-start px-2">
                                            <div className="flex items-center w-28 gap-3 text-xs 2xl:text-sm text-text-secondary pt-0.5">
                                                <BookOpen size={16} />
                                                <span>Notespace</span>
                                            </div>
                                            <div className="flex-1">
                                                {openMeta === 'notebook' ? (
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {notebooks.map(nb => (
                                                            <button key={nb} type="button"
                                                                onClick={() => { setNotebook(nb); setOpenMeta(null); }}
                                                                className={`px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-md text-xs 2xl:text-sm font-normal border transition-all ${notebook === nb
                                                                    ? 'bg-primary/20 text-secondary border-primary/30'
                                                                    : 'bg-white border-gray-200 text-text-secondary hover:border-gray-300'}`}
                                                            >{nb}</button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <button type="button"
                                                        onClick={() => setOpenMeta('notebook')}
                                                        className="px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-md text-xs 2xl:text-sm font-normal border bg-primary/10 text-secondary border-primary/20 hover:border-primary/40 transition-all"
                                                    >
                                                        {notebook || 'Select…'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Labels */}
                                        <div className="flex items-start px-2">
                                            <div className="flex items-center w-28 gap-3 text-xs 2xl:text-sm text-text-secondary pt-0.5">
                                                <Tag size={16} />
                                                <span>Labels</span>
                                            </div>
                                            <div className="flex-1">
                                                {openMeta === 'labels' ? (
                                                    <div className="flex flex-col gap-2">
                                                        {/* Selected */}
                                                        {tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {tags.map(label => {
                                                                    const s = getLabelStyle(label.color);
                                                                    return (
                                                                        <span key={label.text}
                                                                            className={`flex items-center gap-1.5 px-2 py-1 ${s.bg} ${s.text} text-xs 2xl:text-sm rounded-md`}>
                                                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
                                                                            {label.text}
                                                                            <button type="button" onClick={() => removeTag(label.text)}
                                                                                className="hover:opacity-60 ml-0.5 transition-opacity">
                                                                                <X size={10} />
                                                                            </button>
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        {/* Available */}
                                                        {availableTags.filter(l => !tags.some(t => t.text === l.text)).length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {availableTags.filter(l => !tags.some(t => t.text === l.text)).map(l => {
                                                                    const s = getLabelStyle(l.color);
                                                                    return (
                                                                        <button type="button" key={l.text}
                                                                            onClick={() => setTags(prev => [...prev, l])}
                                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs 2xl:text-sm ${s.bg} ${s.text} border border-transparent hover:border-current/20 transition-colors`}>
                                                                            <Tag size={11} />
                                                                            {l.text}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        {/* New label input */}
                                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus-within:border-primary transition-all">
                                                            <Plus size={13} className="text-gray-400 shrink-0" />
                                                            <input type="text"
                                                                value={tagSearch}
                                                                onChange={e => setTagSearch(e.target.value)}
                                                                placeholder="New label, press Enter…"
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
                                                                    className="text-xs 2xl:text-sm text-secondary bg-primary/20 px-2.5 py-1 rounded-md shrink-0">
                                                                    Add
                                                                </button>
                                                            )}
                                                        </div>
                                                        <button type="button" onClick={() => setOpenMeta(null)}
                                                            className="text-xs 2xl:text-sm text-text-secondary hover:text-text-primary self-start ml-1 transition-colors">
                                                            Done
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {tags.length > 0
                                                            ? tags.map(label => {
                                                                const s = getLabelStyle(label.color);
                                                                return (
                                                                    <button key={label.text} type="button"
                                                                        onClick={() => setOpenMeta('labels')}
                                                                        className={`flex items-center gap-1 px-2 py-0.5 2xl:px-2.5 2xl:py-1 ${s.bg} ${s.text} text-xs 2xl:text-sm rounded-md border border-transparent`}>
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
                                                                        {label.text}
                                                                    </button>
                                                                );
                                                            })
                                                            : (
                                                                <button type="button" onClick={() => setOpenMeta('labels')}
                                                                    className="px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-md text-xs 2xl:text-sm font-normal border bg-white border-gray-200 text-text-secondary hover:border-gray-300 transition-all">
                                                                    Add label…
                                                                </button>
                                                            )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Attachments */}
                                        <div className="flex items-center px-2">
                                            <div className="flex items-center w-28 gap-3 text-xs 2xl:text-sm text-text-secondary">
                                                <Paperclip size={16} />
                                                <span>Attach</span>
                                            </div>
                                            <div className="flex flex-1 gap-1.5">
                                                {/* Hidden inputs */}
                                                <input ref={docInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt"
                                                    onChange={e => { const f = e.target.files?.[0]; if (f) { handleInternalDocUpload(f); if (docInputRef.current) docInputRef.current.value = ''; } }}
                                                />
                                                <input ref={audioInputRef} type="file" className="hidden" accept="audio/*,.mp3,.wav,.m4a,.ogg"
                                                    onChange={e => { const f = e.target.files?.[0]; if (f) { handleInternalAudioUpload(f); if (audioInputRef.current) audioInputRef.current.value = ''; } }}
                                                />
                                                <button type="button" onClick={() => docInputRef.current?.click()} disabled={isUploading}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-md border text-xs 2xl:text-sm font-normal bg-white transition-colors
                                                        ${effectiveDocUrl ? 'border-secondary/40 text-secondary' : 'border-gray-200 text-text-secondary hover:border-gray-300'} disabled:opacity-50`}>
                                                    {isUploading && !effectiveAudioFile ? <Loader2 size={12} className="animate-spin" /> : <Paperclip size={12} />}
                                                    {effectiveDocUrl ? 'Attached' : 'Document'}
                                                </button>
                                                <button type="button" onClick={() => audioInputRef.current?.click()} disabled={isUploading}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-md border text-xs 2xl:text-sm font-normal bg-white transition-colors
                                                        ${effectiveAudioUploaded ? 'border-secondary/40 text-secondary' : 'border-gray-200 text-text-secondary hover:border-gray-300'} disabled:opacity-50`}>
                                                    {isUploading && effectiveAudioFile ? <Loader2 size={12} className="animate-spin" /> : <Mic size={12} />}
                                                    {effectiveAudioUploaded ? 'Voice' : 'Voice Note'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Waveform — only visible after audio upload */}
                                        {effectiveAudioUploaded && (
                                            <div className="flex flex-col gap-1.5 bg-white border border-gray-200 rounded-xl px-4 py-3 mx-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mic size={13} className="text-secondary" />
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

                                    {/* Notes editor — at the bottom */}
                                    <div className="flex flex-col mt-3">
                                        <div className="relative min-h-[220px] w-full">
                                            <RichTextEditor content={preview} onChange={setPreview} placeholder="Start writing your note..." />
                                        </div>

                                        {/* Polish row — below editor, not overlapping */}
                                        {preview.trim() && (
                                            <div className="flex items-center justify-between gap-2 mt-2 2xl:mt-3">
                                                <p className="text-xs 2xl:text-sm text-text-secondary flex items-center gap-1.5 flex-1 min-w-0">
                                                    <Sparkles size={12} className="text-secondary shrink-0" />
                                                    <span className="truncate">Let FloAI refine and structure your notes.</span>
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={handlePolish}
                                                    disabled={isPolishing}
                                                    className="flex shrink-0 items-center gap-1.5 px-2 py-1.5 2xl:px-3 2xl:py-2 rounded-md bg-white border border-gray-200 text-xs 2xl:text-sm font-medium text-text-secondary hover:text-secondary hover:border-primary/40 hover:shadow transition-all disabled:opacity-60"
                                                >
                                                    {isPolishing
                                                        ? <Loader2 size={13} className="animate-spin text-secondary" />
                                                        : <img src={aiAssistant} className='w-4 h-4 md:w-5 sm:h-5' alt="AI" />
                                                    }
                                                    {isPolishing ? 'Polishing...' : 'Polish'}
                                                </button>
                                            </div>
                                        )}

                                        {/* Word count */}
                                        {preview.trim() && (
                                            <p className="text-[11px] 2xl:text-xs text-text-secondary mt-1 text-right">
                                                {countWords(preview)} words
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-auto px-5 2xl:px-7 py-4 2xl:py-5 flex items-center gap-3 shrink-0">
                                    <button type="button" onClick={onClose}
                                        className="flex-1 py-2.5 2xl:py-3 rounded-md border cursor-pointer border-gray-200 text-sm 2xl:text-base font-normal text-gray-500 bg-white transition-colors">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={handleSave}
                                        className="flex-1 py-2.5 2xl:py-3 rounded-md cursor-pointer bg-linear-to-t from-primary to-primary/80 text-text-primary text-sm 2xl:text-base font-normal hover:opacity-90 transition-opacity">
                                        {initialTitle ? 'Save Changes' : 'Add Note'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default AddNoteModal;
