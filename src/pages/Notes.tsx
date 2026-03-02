import { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuest } from '../context/QuestContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Search, Send, Loader2, X, CloudUpload, Sparkles, Pin, SortAsc, ChevronDown, Check } from 'lucide-react';
import DashboardLayout from '../ui/DashboardLayout';
import NoteCard from '../components/notes/NoteCard';
import FloatingAIButton from '../components/common/FloatingAIButton';
import AddNoteModal from '../components/notes/AddNoteModal';
import AIChatPanel from '../components/common/AIChatPanel';
import FlashcardModal from '../components/notes/FlashcardModal';
import fAIAssistant from '../assets/images/icon-ai-assistant.png';

export type NoteColor = 'default' | 'yellow' | 'blue' | 'green' | 'red' | 'purple';

export interface Note {
    id: number;
    title: string;
    preview: string;
    timestamp: string;
    tags: string[];
    color: NoteColor;
    pinned: boolean;
    notebook: string;
    wordCount: number;
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

const initialNotes: Note[] = [
    {
        id: 1,
        title: 'PBL Project Research',
        preview: '<p>Summary of quantum computing applications in modern cryptography and their potential vulnerabilities by 2030.</p>',
        timestamp: 'Today, 10:42 AM',
        tags: ['Research', 'CS'],
        color: 'blue',
        pinned: true,
        notebook: 'Research',
        wordCount: 18,
    },
    {
        id: 2,
        title: 'Calculus III Notes',
        preview: '<p>Multivariable calculus theories including double integrals, vector fields, and Green\'s theorem.</p>',
        timestamp: 'Yesterday, 14:30 PM',
        tags: ['Math'],
        color: 'green',
        pinned: false,
        notebook: 'Lectures',
        wordCount: 14,
    },
    {
        id: 3,
        title: 'Productivity Ideas',
        preview: '<p>Brainstorming for the new Flo app features: AI summarization, Pomodoro integration, and ambient sounds.</p>',
        timestamp: 'Mon, 08:15 AM',
        tags: ['Ideas', 'Product'],
        color: 'purple',
        pinned: false,
        notebook: 'Personal',
        wordCount: 16,
    },
];

const Notes = () => {
    const { progressQuest } = useQuest();
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [notebooks, setNotebooks] = useState<string[]>(DEFAULT_NOTEBOOKS);
    const [isAddingNotebook, setIsAddingNotebook] = useState(false);
    const [newNotebookName, setNewNotebookName] = useState('');

    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isDragOverDropzone, setIsDragOverDropzone] = useState(false);
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
    const [summaryPreview, setSummaryPreview] = useState<{ fileName: string; title: string; preview: string; tags: string[] } | null>(null);
    const [prompt, setPrompt] = useState('');
    const [promptLoading, setPromptLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
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
                tags: ['AI Summary'],
            });
            setUploadStatus('preview');
        }, 1500);
    };

    const handleAddSummaryToNotes = () => {
        if (summaryPreview) {
            const newNote: Note = {
                id: Date.now(),
                title: summaryPreview.title,
                preview: summaryPreview.preview,
                timestamp: 'Just now',
                tags: summaryPreview.tags,
                color: 'yellow',
                pinned: false,
                notebook: selectedNotebook === 'All Notes' ? 'Lectures' : selectedNotebook,
                wordCount: countWords(summaryPreview.preview),
            };
            setNotes(prev => [newNote, ...prev]);
            progressQuest('ai'); // auto-detect: AI note generated
            setUploadStatus('idle');
            setSummaryPreview(null);
        }
    };

    const availableTags = useMemo(() => {
        const all = notes.flatMap(n => n.tags);
        return Array.from(new Set(all)).sort();
    }, [notes]);

    const { pinnedNotes, unpinnedNotes } = useMemo(() => {
        let filtered = notes.filter(note => {
            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.preview.replace(/<[^>]+>/g, '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
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

    const allFiltered = [...pinnedNotes, ...unpinnedNotes];

    const handleOpenAddNote = () => { setEditingNoteId(null); setIsAddNoteModalOpen(true); };
    const handleOpenEditNote = (id: number) => { setEditingNoteId(id); setIsAddNoteModalOpen(true); };

    const handleSaveNote = (title: string, preview: string, tags: string[], color: NoteColor, notebook: string) => {
        const wc = countWords(preview);
        if (editingNoteId !== null) {
            setNotes(prev => prev.map(n =>
                n.id === editingNoteId ? { ...n, title, preview, tags, color, notebook, wordCount: wc } : n
            ));
        } else {
            setNotes(prev => [{ id: Date.now(), title, preview, timestamp: 'Just now', tags, color, pinned: false, notebook, wordCount: wc }, ...prev]);
            progressQuest('note'); // auto-detect: note created
        }
    };

    const handlePinToggle = (id: number) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: number) => {
        e.dataTransfer.setData('text/plain', noteId.toString());
    };
    const handleDragEnd = () => setIsDragOverDropzone(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const noteId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(noteId)) setConfirmDeleteId(noteId); // show confirmation first
        setIsDragOverDropzone(false);
    };
    const handleRequestDelete = (id: number) => setConfirmDeleteId(id);
    const confirmDelete = () => {
        if (confirmDeleteId !== null) setNotes(prev => prev.filter(n => n.id !== confirmDeleteId));
        setConfirmDeleteId(null);
    };
    const cancelDelete = () => setConfirmDeleteId(null);

    const generateTopicSummary = (topic: string): string => {
        const t = topic.trim();
        return `<p><strong>📚 Overview</strong></p>
<p>${t} is an important topic that encompasses a wide range of concepts and principles. Understanding ${t} provides a solid foundation for deeper study and practical application in this field.</p>
<p><strong>🎯 Key Concepts</strong></p>
<ul>
<li><strong>Fundamentals of ${t}</strong> — The core principles and definitions that form the basis of this topic.</li>
<li><strong>Historical context</strong> — How ${t} evolved over time and its significance in the broader field.</li>
<li><strong>Core theories</strong> — The main theoretical frameworks used to understand and analyze ${t}.</li>
<li><strong>Practical applications</strong> — Real-world uses and case studies where ${t} is applied.</li>
<li><strong>Common challenges</strong> — Typical difficulties encountered when working with ${t} and how to overcome them.</li>
</ul>
<p><strong>📝 Summary</strong></p>
<p>A strong grasp of ${t} allows you to apply its principles effectively in both academic and professional contexts. Continue exploring this topic by reviewing related subtopics and practicing with examples.</p>`;
    };

    const handleGenerateFromPrompt = async () => {
        if (!prompt.trim() || promptLoading) return;
        setPromptLoading(true);
        const topic = prompt.trim();
        await new Promise(r => setTimeout(r, 1400));
        const content = generateTopicSummary(topic);
        setNotes(prev => [{
            id: Date.now(), title: topic, preview: content,
            timestamp: 'Just now', tags: ['AI Summary'], color: 'yellow',
            pinned: false, notebook: selectedNotebook === 'All Notes' ? 'Lectures' : selectedNotebook,
            wordCount: countWords(content),
        }, ...prev]);
        setPrompt('');
        setPromptLoading(false);
    };

    const editingNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : null;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-5">

                {/* Header */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6 flex items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">Notes</h2>
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
                                ${isDragOverDropzone ? 'bg-red-500 border-red-500 text-white scale-105 shadow-lg shadow-red-500/30' : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}
                            onDragOver={e => { e.preventDefault(); setIsDragOverDropzone(true); }}
                            onDragLeave={() => setIsDragOverDropzone(false)}
                            onDrop={handleDrop}
                        >
                            <Trash2 size={14} className={isDragOverDropzone ? 'animate-bounce' : ''} />
                            <span className="hidden sm:inline">Drop to Delete</span>
                        </div>
                        <button onClick={handleOpenAddNote} className="flex items-center gap-2 sm:w-auto bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-4! py-3! text-sm! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-lg!">
                            <Plus size={16} /><span className="hidden sm:inline">New Note</span>
                        </button>
                    </div>
                </header>

                <div className="px-4 md:pr-10 md:pl-0 pb-2">

                    {/* AI Generate bar */}
                    <div className="mb-4 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/10 transition-all">
                        <img src={fAIAssistant} alt="AI" className="w-7 h-7 shrink-0" />
                        <input value={prompt} onChange={e => setPrompt(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleGenerateFromPrompt()}
                            placeholder="Generate a note with FloAI — type a topic and press Enter..."
                            className="flex-1 h-10 sm:h-12 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                        />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={handleGenerateFromPrompt} disabled={!prompt.trim() || promptLoading}
                            className="flex items-center gap-2.5 bg-primary disabled:bg-bg-app text-text-primary disabled:text-gray-400 px-3.5 py-3 rounded-xl text-xs font-medium transition-colors shrink-0"
                        >
                            {promptLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            <span className="hidden sm:inline">{promptLoading ? 'Generating...' : 'Generate'}</span>
                        </motion.button>
                    </div>

                    {/* Upload zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); if (e.dataTransfer.types.includes('Files')) setIsDraggingFile(true); }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={e => { e.preventDefault(); setIsDraggingFile(false); const f = e.dataTransfer.files?.[0]; if (f) handleUploadFile(f); }}
                        className={`mb-4 flex items-center gap-3 bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200
                            ${isDraggingFile ? 'border-secondary bg-secondary/5 shadow-md scale-[1.01]' : uploadStatus === 'generating' ? 'border-primary/30 bg-primary/5' : 'border-dashed border-gray-200 hover:border-primary/40 hover:bg-gray-50/50'}`}
                    >
                        <input type="file" ref={fileInputRef} className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) { handleUploadFile(f); if (fileInputRef.current) fileInputRef.current.value = ''; } }}
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDraggingFile ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'}`}>
                            {uploadStatus === 'generating' ? <Loader2 size={15} className="animate-spin text-secondary" /> : <CloudUpload size={15} />}
                        </div>
                        <p className="flex-1 text-sm text-gray-500">
                            {uploadStatus === 'generating' ? 'Running AI Magic Summary...' : isDraggingFile ? 'Drop to generate summary!' : 'Upload PDF, Word or Text — generate an AI summary'}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary shrink-0">
                            <Sparkles size={12} /><span className="hidden sm:inline">Magic Summary</span>
                        </div>
                    </div>

                    {/* AI Summary banner */}
                    <AnimatePresence>
                        {uploadStatus === 'preview' && summaryPreview && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="mb-4 bg-white border border-primary/30 rounded-xl px-5 py-4 flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">✨ Magic Summary Ready</p>
                                    <p className="text-sm font-medium text-gray-800 truncate">{summaryPreview.title}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={handleAddSummaryToNotes} className="px-3 py-1.5 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 transition-opacity">Add to Notes</button>
                                    <button onClick={() => { setUploadStatus('idle'); setSummaryPreview(null); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X size={14} /></button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Notebook horizontal tabs */}
                    <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {notebooks.map(nb => (
                            <div key={nb} className="relative group shrink-0">
                                <button onClick={() => setSelectedNotebook(nb)}
                                    className={`pr-6 pl-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                                        ${selectedNotebook === nb ? 'bg-primary/15 text-secondary' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
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
                                        <X size={9} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {isAddingNotebook ? (
                            <div className="flex items-center gap-1 shrink-0 ml-1">
                                <input autoFocus value={newNotebookName}
                                    onChange={e => setNewNotebookName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') confirmAddNotebook(); if (e.key === 'Escape') { setIsAddingNotebook(false); setNewNotebookName(''); } }}
                                    placeholder="Notebook name..."
                                    className="w-32 px-2.5 py-1.5 text-xs bg-white border border-primary/40 rounded-md outline-none text-gray-700"
                                />
                                <button onClick={confirmAddNotebook} className="w-6 h-6 flex items-center justify-center rounded-md bg-primary/15 text-secondary hover:bg-primary/25 transition-colors">
                                    <Check size={12} />
                                </button>
                                <button onClick={() => { setIsAddingNotebook(false); setNewNotebookName(''); }} className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsAddingNotebook(true)}
                                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-white transition-all ml-1"
                            >
                                <Plus size={12} /> New
                            </button>
                        )}
                    </div>

                    {/* Filter / sort row */}
                    <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative">
                                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-primary transition-all w-40"
                                />
                            </div>
                            <button onClick={() => setSelectedTag(null)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${selectedTag === null ? 'bg-primary/15 text-secondary' : 'text-gray-500 hover:bg-white'}`}
                            >All</button>
                            {availableTags.map(tag => (
                                <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${selectedTag === tag ? 'bg-primary/15 text-secondary' : 'text-gray-500 hover:bg-white'}`}
                                >{tag}</button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium hidden sm:inline">{allFiltered.length} notes</span>
                            <div className="relative" ref={sortRef}>
                                <button onClick={() => setIsSortOpen(o => !o)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 font-medium hover:bg-gray-50 transition-all"
                                >
                                    <SortAsc size={13} />
                                    <span className="hidden sm:inline">{SORT_LABELS[sortBy]}</span>
                                    <ChevronDown size={12} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isSortOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                                                className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-20 w-40 py-1.5 overflow-hidden"
                                            >
                                                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([val, label]) => (
                                                    <button key={val} onClick={() => { setSortBy(val); setIsSortOpen(false); }}
                                                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${sortBy === val ? 'text-secondary bg-primary/5' : 'text-gray-600 hover:bg-gray-50'}`}
                                                    >{label}</button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Pinned section */}
                    {pinnedNotes.length > 0 && (
                        <div className="mb-5">
                            <div className="flex items-center gap-1.5 mb-3">
                                <Pin size={12} className="text-secondary" />
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pinned</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Other Notes</p>
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
                onClose={() => { setIsAddNoteModalOpen(false); setTimeout(() => setEditingNoteId(null), 300); }}
                onSave={handleSaveNote}
                initialTitle={editingNote?.title}
                initialPreview={editingNote?.preview}
                initialTags={editingNote?.tags}
                initialColor={editingNote?.color}
                initialNotebook={editingNote?.notebook}
                availableTags={availableTags}
                notebooks={notebooks.filter(n => n !== 'All Notes')}
            />

            <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            {flashcardNoteId !== null && (() => {
                const note = notes.find(n => n.id === flashcardNoteId);
                return note ? (
                    <FlashcardModal
                        isOpen={isFlashcardOpen}
                        onClose={() => { setIsFlashcardOpen(false); setFlashcardNoteId(null); }}
                        noteTitle={note.title}
                        noteContent={note.preview}
                    />
                ) : null;
            })()}

            {/* Delete confirmation portal */}
            {confirmDeleteId !== null && createPortal(
                <AnimatePresence>
                    <motion.div key="confirm-overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-4"
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
            )}
        </DashboardLayout>
    );
};

export default Notes;
