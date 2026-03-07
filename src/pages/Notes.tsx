import { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuest } from '../context/QuestContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Loader2, X, CloudUpload, Pin, SortAsc, ChevronDown, Check, Mic, Tag, Trash2 } from 'lucide-react';
import DashboardLayout from '../ui/DashboardLayout';
import NoteCard from '../components/notes/NoteCard';
import FloatingAIButton from '../components/common/FloatingAIButton';
import AIChatPanel from '../components/common/AIChatPanel';
import AddNoteModal from '../components/notes/AddNoteModal';
import FlashcardModal from '../components/notes/FlashcardModal';
import fAIAssistant from '../assets/images/icon-ai-assistant.png';
import dummyPdf from '../assets/docs/dummy_doc.pdf';
import { TypingText } from '../components/common/TypingText';

export type NoteColor = 'default' | 'yellow' | 'blue' | 'green' | 'red' | 'purple';

export interface Label {
    text: string;
    color: string;
}

export interface Note {
    id: number;
    title: string;
    preview: string;
    timestamp: string;
    tags: Label[];
    color: NoteColor;
    pinned: boolean;
    notebook: string;
    wordCount: number;
    documentUrl?: string;
}

export const NOTE_COLORS: { value: NoteColor; label: string; bg: string; border: string }[] = [
    { value: 'default', label: 'Default', bg: 'bg-white', border: 'border-gray-200' },
    { value: 'yellow', label: 'Yellow', bg: 'bg-amber-50', border: 'border-amber-200' },
    { value: 'blue', label: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200' },
    { value: 'green', label: 'Green', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { value: 'red', label: 'Red', bg: 'bg-red-50', border: 'border-red-200' },
    { value: 'purple', label: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200' },
];

export const COLOR_DOT: Record<NoteColor, string> = {
    default: 'bg-gray-300',
    yellow: 'bg-amber-400',
    blue: 'bg-blue-400',
    green: 'bg-emerald-400',
    red: 'bg-red-400',
    purple: 'bg-purple-400',
};

type SortOption = 'newest' | 'oldest' | 'az' | 'pinned';

const SORT_LABELS: Record<SortOption, string> = {
    newest: 'Newest first',
    oldest: 'Oldest first',
    az: 'A → Z',
    pinned: 'Pinned first',
};

const DEFAULT_NOTEBOOKS = ['All Notes', 'Lectures', 'Research', 'Personal', 'Projects'];

const countWords = (html: string): number => {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
};

import { initialNotes } from '../data/mockNotes';

const Notes = () => {
    const { progressQuest } = useQuest();
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [notebooks, setNotebooks] = useState<string[]>(DEFAULT_NOTEBOOKS);
    const [isAddingNotebook, setIsAddingNotebook] = useState(false);
    const [newNotebookName, setNewNotebookName] = useState('');

    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [uploadedDocUrl, setUploadedDocUrl] = useState<string | null>(null);
    const [audioUploaded, setAudioUploaded] = useState(false);
    const [audioFileName, setAudioFileName] = useState<string | undefined>();
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedNotebook, setSelectedNotebook] = useState('All Notes');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
    const [flashcardNoteId, setFlashcardNoteId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const [uploadStatus, setUploadStatus] = useState<'idle' | 'generating' | 'preview'>('idle');
    const [summaryPreview, setSummaryPreview] = useState<{ fileName: string; title: string; preview: string; tags: Label[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    const confirmAddNotebook = () => {
        const name = newNotebookName.trim();
        if (name && !notebooks.includes(name)) {
            setNotebooks(prev => [...prev, name]);
            setSelectedNotebook(name);
        }
        setIsAddingNotebook(false);
        setNewNotebookName('');
    };

    const handleUploadFile = (file: File) => {
        setUploadStatus('generating');
        setTimeout(() => {
            setSummaryPreview({
                fileName: file.name,
                title: `Summary: ${file.name.replace(/\.[^/.]+$/, '')}`,
                preview: `<p>AI generated summary for <strong>${file.name}</strong>. The document covers fundamental concepts and key takeaways. This summary highlights the core ideas and provides a structured overview of the material.</p>`,
                tags: [{ text: 'AI Summary', color: 'amber' }],
            });
            setUploadedDocUrl(dummyPdf);
            setEditingNoteId(null);
            setIsAddNoteModalOpen(true);
            setUploadStatus('idle');
        }, 1500);
    };

    const handleUploadAudio = (file: File) => {
        setUploadStatus('generating');
        setTimeout(() => {
            setSummaryPreview({
                fileName: file.name,
                title: `Voice Note: ${file.name.replace(/\.[^/.]+$/, '')}`,
                preview: `<p>AI transcription of <strong>${file.name}</strong>. The recording has been analyzed and key points extracted into this structured note.</p>`,
                tags: [{ text: 'Voice Note', color: 'sky' }, { text: 'AI Summary', color: 'amber' }],
            });
            setUploadedDocUrl(null);
            setAudioUploaded(true);
            setAudioFileName(file.name);
            setEditingNoteId(null);
            setIsAddNoteModalOpen(true);
            setUploadStatus('idle');
        }, 1500);
    };



    const availableTags = useMemo(() => {
        const all = notes.flatMap(n => n.tags);
        const unique = Array.from(new Map(all.map(l => [l.text, l])).values());
        return unique.sort((a, b) => a.text.localeCompare(b.text));
    }, [notes]);

    const { pinnedNotes, unpinnedNotes } = useMemo(() => {
        let filtered = notes.filter(note => {
            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.preview.replace(/<[^>]+>/g, '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTag = selectedTag ? note.tags.some(l => l.text === selectedTag) : true;
            const matchesNotebook = selectedNotebook === 'All Notes' ? true : note.notebook === selectedNotebook;
            return matchesSearch && matchesTag && matchesNotebook;
        });
        const sortFn = (a: Note, b: Note) => {
            if (sortBy === 'az') return a.title.localeCompare(b.title);
            if (sortBy === 'oldest') return a.id - b.id;
            return b.id - a.id;
        };
        filtered = [...filtered].sort(sortFn);
        return {
            pinnedNotes: filtered.filter(n => n.pinned),
            unpinnedNotes: filtered.filter(n => !n.pinned),
        };
    }, [notes, searchQuery, selectedTag, selectedNotebook, sortBy]);



    const handleOpenAddNote = () => { setEditingNoteId(null); setIsAddNoteModalOpen(true); };
    const handleOpenEditNote = (id: number) => {
        setEditingNoteId(id);
        const noteToEdit = notes.find(n => n.id === id);
        if (noteToEdit?.documentUrl) setUploadedDocUrl(noteToEdit.documentUrl);
        else setUploadedDocUrl(null);
        setIsAddNoteModalOpen(true);
    };

    const handleSaveNote = (title: string, preview: string, tags: Label[], color: NoteColor, notebook: string) => {
        const wc = countWords(preview);
        if (editingNoteId !== null) {
            setNotes(prev => prev.map(n =>
                n.id === editingNoteId ? { ...n, title, preview, tags, color, notebook, wordCount: wc, documentUrl: uploadedDocUrl || undefined } : n
            ));
        } else {
            setNotes(prev => [{ id: Date.now(), title, preview, timestamp: 'Just now', tags, color, pinned: false, notebook, wordCount: wc, documentUrl: uploadedDocUrl || undefined }, ...prev]);
            progressQuest('note');
            if (uploadedDocUrl) {
                progressQuest('ai');
            }
        }
    };

    const handlePinToggle = (id: number) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: number) => {
        e.dataTransfer.setData('text/plain', noteId.toString());
    };
    const handleDragEnd = () => { };

    const handleRequestDelete = (id: number) => setConfirmDeleteId(id);
    const confirmDelete = () => {
        if (confirmDeleteId !== null) setNotes(prev => prev.filter(n => n.id !== confirmDeleteId));
        setConfirmDeleteId(null);
    };
    const cancelDelete = () => setConfirmDeleteId(null);



    const editingNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : null;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-5">

                {/* Header */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6 flex items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">Notes</h2>
                </header>

                <div className="px-4 md:pr-10 md:pl-0 pb-2">

                    {/* AI Generate + Upload — side by side / stacked on mobile */}
                    <div className="mb-4">
                        <div className="flex flex-col lg:flex-row items-stretch gap-5 lg:items-center lg:justify-between">

                            {/* Adjust this width to take the remaining space */}
                            <div className="w-full lg:flex-1 flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none">

                                <img src={fAIAssistant} alt="AI" className="w-8 h-8 shrink-0" />
                                <TypingText />
                            </div>

                            {/* Right: Upload PDF / Audio */}
                            <div className="flex gap-2 shrink-0 lg:w-auto w-full">
                                {/* Upload Document Box */}
                                <div className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 bg-white border rounded-lg transition-all duration-200
                                    ${isDraggingFile ? 'border-secondary bg-secondary/5 scale-[1.01]' : uploadStatus === 'generating' ? 'border-secondary' : 'border-gray-200'}
                                    ${uploadStatus !== 'preview' ? 'cursor-pointer' : ''}`}
                                    onClick={() => uploadStatus === 'idle' || uploadStatus === 'generating' ? fileInputRef.current?.click() : undefined}
                                    onDragOver={e => { e.preventDefault(); if (e.dataTransfer.types.includes('Files')) setIsDraggingFile(true); }}
                                    onDragLeave={() => setIsDraggingFile(false)}
                                    onDrop={e => { e.preventDefault(); setIsDraggingFile(false); const f = e.dataTransfer.files?.[0]; if (f) handleUploadFile(f); }}
                                >
                                    <input type="file" ref={fileInputRef} className="hidden"
                                        onChange={e => { const f = e.target.files?.[0]; if (f) { handleUploadFile(f); if (fileInputRef.current) fileInputRef.current.value = ''; } }}
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                    <div className={` rounded-lg flex items-center justify-center shrink-0 ${isDraggingFile ? 'text-secondary' : ' text-text-secondary'}`}>
                                        {uploadStatus === 'generating' ? <Loader2 size={15} className="animate-spin text-secondary" /> : <CloudUpload size={16} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-normal text-text-secondary whitespace-nowrap">
                                            {uploadStatus === 'generating' ? 'Processing...' : uploadStatus === 'preview' && summaryPreview ? summaryPreview.fileName : 'Document'}
                                        </span>
                                    </div>
                                </div>

                                {/* Upload Mic Box */}
                                <button type="button" onClick={() => audioInputRef.current?.click()} className="flex-1 lg:flex-none flex justify-center lg:justify-start cursor-pointer items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors shrink-0 outline-none">
                                    <input
                                        type="file"
                                        ref={audioInputRef}
                                        className="hidden"
                                        accept="audio/*,.mp3,.wav,.m4a,.ogg"
                                        onChange={e => { const f = e.target.files?.[0]; if (f) { handleUploadAudio(f); if (audioInputRef.current) audioInputRef.current.value = ''; } }}
                                    />
                                    <div className="rounded-lg  text-text-secondary flex items-center justify-center shrink-0">
                                        {uploadStatus === 'generating' ? <Loader2 size={14} className="animate-spin text-secondary" /> : <Mic size={16} />}
                                    </div>
                                    <span className="text-sm font-normal text-text-secondary whitespace-nowrap">Voice Note</span>
                                </button>
                                <div className="flex items-center gap-3">
                                    <button onClick={handleOpenAddNote} className="flex items-center gap-2 sm:w-auto bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-4! py-3! text-sm! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-lg!">
                                        <Plus size={16} /><span className="hidden sm:inline">New Note</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Notespace section */}
                    <div className="mt-4 mb-5">
                        {/* Header */}
                        <h4 className="text-lg font-medium text-text-primary mb-3">Notespace</h4>

                        {/* Single row */}
                        <div className="flex items-center gap-2">

                            {/* Scrollable notebook tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-0 flex-1" style={{ scrollbarWidth: 'none' }}>

                                {notebooks.map(nb => (
                                    <div key={nb} className="relative group shrink-0">
                                        <button onClick={() => setSelectedNotebook(nb)}
                                            className={`pr-6 pl-3.5 py-2 rounded-md text-sm font-normal transition-all whitespace-nowrap
                                            ${selectedNotebook === nb ? 'bg-primary/20 text-secondary' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
                                        >{nb}</button>
                                        {nb !== 'All Notes' && (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setNotebooks(prev => prev.filter(n => n !== nb));
                                                    if (selectedNotebook === nb) setSelectedNotebook('All Notes');
                                                }}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={11} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {isAddingNotebook ? (
                                    <div className="flex items-center gap-2 shrink-0 ml-1">
                                        <input autoFocus value={newNotebookName}
                                            onChange={e => setNewNotebookName(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') confirmAddNotebook(); if (e.key === 'Escape') { setIsAddingNotebook(false); setNewNotebookName(''); } }}
                                            placeholder="Notebook name..."
                                            className="w-32 px-3 py-2 text-xs bg-white border border-primary/40 rounded-md outline-none text-gray-700"
                                        />
                                        <button onClick={confirmAddNotebook} className="w-7 h-7 flex items-center justify-center rounded-md bg-primary/15 text-secondary hover:bg-primary/25 transition-colors">
                                            <Check size={14} />
                                        </button>
                                        <button onClick={() => { setIsAddingNotebook(false); setNewNotebookName(''); }} className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsAddingNotebook(true)}
                                        className="shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white transition-all ml-1"
                                    >
                                        <Plus size={12} /> New
                                    </button>
                                )}
                            </div>

                            {/* Fixed right */}
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="relative">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-text-primary placeholder:text-text-secondary outline-none focus:border-primary transition-all w-36 sm:w-44"
                                    />
                                </div>
                                <div className="relative" ref={sortRef}>
                                    <button onClick={() => setIsSortOpen(o => !o)}
                                        className="flex items-center gap-1.5 px-3 py-[11px] bg-white border border-gray-200 rounded-lg text-sm text-text-secondary font-medium hover:bg-gray-50 transition-all"
                                    >
                                        <SortAsc size={15} />
                                        <span className="hidden sm:inline">{SORT_LABELS[sortBy]}</span>
                                        <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isSortOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                                                    className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-lg shadow-lg z-20 w-60  overflow-hidden"
                                                >
                                                    {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([val, label]) => (
                                                        <button key={val} onClick={() => { setSortBy(val); setIsSortOpen(false); }}
                                                            className={`w-full text-left px-4 py-4 text-sm font-normal transition-colors ${sortBy === val ? 'text-secondary bg-primary/20' : 'text-gray-600 hover:bg-gray-50'}`}
                                                        >{label}</button>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Label Filter Row */}
                    {availableTags.length > 0 && (
                        <div className="mb-5">
                            <div
                                className="flex items-center gap-2 overflow-x-auto"
                                style={{ scrollbarWidth: 'none' }}
                            >
                                {/* All chip */}
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                                        ${selectedTag === null
                                            ? 'bg-text-primary text-white'
                                            : 'bg-white border border-gray-200 text-text-secondary hover:border-gray-300 hover:text-text-primary'
                                        }`}
                                >
                                    All Labels
                                </button>

                                {availableTags.map(tag => (
                                    <button
                                        key={tag.text}
                                        onClick={() => setSelectedTag(prev => prev === tag.text ? null : tag.text)}
                                        className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                                            ${selectedTag === tag.text
                                                ? 'bg-text-primary text-white'
                                                : 'bg-white border border-gray-200 text-text-secondary hover:border-gray-300 hover:text-text-primary'
                                            }`}
                                    >
                                        <Tag size={14} />
                                        {tag.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Pinned section */}
                    {pinnedNotes.length > 0 && (
                        <div className="mb-5">
                            <div className="flex items-center gap-1.5 mb-3">
                                <Pin size={16} className="text-secondary" />
                                <span className="text-base font-medium text-text-primary">Pinned</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <AnimatePresence>
                                    {pinnedNotes.map((note, idx) => (
                                        <motion.div key={note.id} layout
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.04 }}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <NoteCard note={note} colorConfig={NOTE_COLORS} colorDot={COLOR_DOT}
                                                onClick={() => handleOpenEditNote(note.id)}
                                                onDragStart={handleDragStart} onPinToggle={handlePinToggle}
                                                onDelete={handleRequestDelete}
                                                onGenerateFlashcard={id => { setFlashcardNoteId(id); setIsFlashcardOpen(true); progressQuest('flashcard'); }}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* Notes grid */}
                    {unpinnedNotes.length === 0 && pinnedNotes.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200">

                            <p className="text-sm text-gray-400 font-medium">No notes found. Create one or adjust your filters.</p>
                        </motion.div>
                    ) : unpinnedNotes.length > 0 && (
                        <>
                            {pinnedNotes.length > 0 && (
                                <p className="text-base font-medium text-text-primary mb-3">Other Notes</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                                <AnimatePresence>
                                    {unpinnedNotes.map((note, idx) => (
                                        <motion.div key={note.id} layout
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.04 }}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <NoteCard note={note} colorConfig={NOTE_COLORS} colorDot={COLOR_DOT}
                                                onClick={() => handleOpenEditNote(note.id)}
                                                onDragStart={handleDragStart} onPinToggle={handlePinToggle}
                                                onDelete={handleRequestDelete}
                                                onGenerateFlashcard={id => { setFlashcardNoteId(id); setIsFlashcardOpen(true); progressQuest('flashcard'); }}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <FloatingAIButton onClick={() => setIsChatOpen(true)} />

            <AddNoteModal
                isOpen={isAddNoteModalOpen}
                onClose={() => {
                    setIsAddNoteModalOpen(false);
                    setTimeout(() => {
                        setEditingNoteId(null);
                        setUploadedDocUrl(null);
                        setSummaryPreview(null);
                        setAudioUploaded(false);
                        setAudioFileName(undefined);
                    }, 300);
                }}
                onSave={handleSaveNote}
                initialTitle={editingNoteId ? editingNote?.title : (uploadedDocUrl ? summaryPreview?.title : '')}
                initialPreview={editingNoteId ? editingNote?.preview : (uploadedDocUrl ? summaryPreview?.preview : '')}
                initialTags={editingNoteId ? editingNote?.tags : (uploadedDocUrl ? summaryPreview?.tags : [])}
                initialColor={editingNoteId ? editingNote?.color : (uploadedDocUrl ? 'yellow' : 'default')}
                initialNotebook={editingNoteId ? editingNote?.notebook : (uploadedDocUrl ? (selectedNotebook === 'All Notes' ? 'Lectures' : selectedNotebook) : undefined)}
                documentUrl={uploadedDocUrl || undefined}
                audioUploaded={audioUploaded}
                audioFileName={audioFileName}
                availableTags={availableTags}
                notebooks={notebooks.filter(n => n !== 'All Notes')}
            />

            <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {
                flashcardNoteId !== null && (() => {
                    const note = notes.find(n => n.id === flashcardNoteId);
                    return note ? (
                        <FlashcardModal
                            isOpen={isFlashcardOpen}
                            onClose={() => { setIsFlashcardOpen(false); setFlashcardNoteId(null); }}
                            noteTitle={note.title}
                            noteContent={note.preview}
                        />
                    ) : null;
                })()
            }

            {/* Delete confirmation portal */}
            {
                confirmDeleteId !== null && createPortal(
                    <AnimatePresence>
                        <motion.div key="confirm-overlay"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center px-4"
                            onClick={cancelDelete}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
                            >
                                <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                    <Trash2 size={20} className="text-red-500" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-1">Delete Note?</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    "{notes.find(n => n.id === confirmDeleteId)?.title ?? 'This note'}" will be permanently deleted.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={cancelDelete}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={confirmDelete}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>,
                    document.body
                )
            }
        </DashboardLayout >
    );
};

export default Notes;
