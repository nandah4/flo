import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Search, Send, Loader2, X, CloudUpload, Sparkles } from 'lucide-react';
import DashboardLayout from '../ui/DashboardLayout';
import NoteCard from '../components/notes/NoteCard';
import FloatingAIButton from '../components/common/FloatingAIButton';
import AddNoteModal from '../components/notes/AddNoteModal';
import AIChatPanel from '../components/common/AIChatPanel';
import FlashcardModal from '../components/notes/FlashcardModal';

import fAIAssistant from '../assets/images/icon-ai-assistant.png';

interface Note {
    id: number;
    title: string;
    preview: string;
    timestamp: string;
    category?: string;
}

const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([
        {
            id: 1,
            title: "PBL Project Research",
            preview: "Summary of quantum computing applications in modern cryptography and their potential vulnerabilities by 2030.",
            timestamp: "Today, 10:42 AM",
            category: "Research"
        },
        {
            id: 2,
            title: "Calculus III Notes",
            preview: "Multivariable calculus theories including double integrals, vector fields, and Green's theorem.",
            timestamp: "Yesterday, 14:30 PM",
            category: "Math"
        },
        {
            id: 3,
            title: "Productivity Ideas",
            preview: "Brainstorming for the new Flo app features: AI summarization, Pomodoro integration, and ambient sounds.",
            timestamp: "Mon, 08:15 AM",
            category: "Ideas"
        }
    ]);

    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isDragOverDropzone, setIsDragOverDropzone] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Flashcard state
    const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
    const [flashcardNoteId, setFlashcardNoteId] = useState<number | null>(null);

    // Upload & Summary Preview State
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'generating' | 'preview'>('idle');
    const [summaryPreview, setSummaryPreview] = useState<{ fileName: string, title: string, preview: string, category: string } | null>(null);

    // AI prompt state
    const [prompt, setPrompt] = useState('');
    const [promptLoading, setPromptLoading] = useState(false);

    // Compute unique categories
    const availableCategories = useMemo(() => {
        const categories = notes.map(n => n.category).filter(Boolean) as string[];
        return Array.from(new Set(categories)).sort();
    }, [notes]);

    // Filter notes based on search query and category
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.preview.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory ? note.category === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [notes, searchQuery, selectedCategory]);

    const handleOpenAddNote = () => {
        setEditingNoteId(null);
        setIsAddNoteModalOpen(true);
    };

    const handleOpenEditNote = (noteId: number) => {
        setEditingNoteId(noteId);
        setIsAddNoteModalOpen(true);
    };

    const handleSaveNote = (title: string, preview: string, category: string) => {
        if (editingNoteId !== null) {
            setNotes(notes.map(note =>
                note.id === editingNoteId
                    ? { ...note, title, preview, category }
                    : note
            ));
        } else {
            const newNote = {
                id: Date.now(),
                title,
                preview,
                timestamp: "Just now",
                category
            };
            setNotes([newNote, ...notes]);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    const handleUploadFile = (file: File) => {
        setUploadStatus('generating');
        setTimeout(() => {
            setSummaryPreview({
                fileName: file.name,
                title: `Summary: ${file.name.replace(/\.[^/.]+$/, "")}`,
                preview: `AI generated summary for the uploaded document. The document covers fundamental concepts and key takeaways about ${file.name}.`,
                category: "AI Summary"
            });
            setUploadStatus('preview');
        }, 1500);
    };

    const handleAddSummaryToNotes = () => {
        if (summaryPreview) {
            setNotes([{ id: Date.now(), title: summaryPreview.title, preview: summaryPreview.preview, timestamp: "Just now", category: summaryPreview.category }, ...notes]);
            setUploadStatus('idle');
            setSummaryPreview(null);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: number) => {
        e.dataTransfer.setData('text/plain', noteId.toString());
    };

    const handleDragEnd = () => setIsDragOverDropzone(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const noteId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(noteId)) setNotes(notes.filter(n => n.id !== noteId));
        setIsDragOverDropzone(false);
    };

    const handleGenerateFromPrompt = async () => {
        if (!prompt.trim() || promptLoading) return;
        setPromptLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        const newNote: Note = {
            id: Date.now(),
            title: prompt.trim(),
            preview: `AI-generated note for: "${prompt.trim()}". Add your content here.`,
            timestamp: "Just now",
            category: "AI"
        };
        setNotes(prev => [newNote, ...prev]);
        setPrompt('');
        setPromptLoading(false);
    };

    const editingNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : null;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-bg-app font-sans pb-5">

                {/* Header */}
                <header className="px-4 md:pr-10 md:pl-0 py-5 md:py-6 flex items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-text-primary">
                        Notes
                    </h2>
                    <div className="flex items-center gap-3">
                        {/* Trash dropzone */}
                        <div
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
                                ${isDragOverDropzone
                                    ? 'bg-red-500 border-red-500 text-white scale-105 shadow-lg shadow-red-500/30'
                                    : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                                }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragOverDropzone(true); }}
                            onDragLeave={() => setIsDragOverDropzone(false)}
                            onDrop={handleDrop}
                        >
                            <Trash2 size={14} className={isDragOverDropzone ? 'animate-bounce' : ''} />
                            <span className="hidden sm:inline">Drop to Delete</span>
                        </div>

                        <button
                            onClick={handleOpenAddNote}
                            className="flex items-center gap-2 sm:w-auto bg-linear-to-t from-primary to-primary/75 hover:bg-primary! text-text-primary px-4! py-3! text-sm! font-medium! cursor-pointer! border-none! hover:scale-105 transition-all duration-300 rounded-lg!"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">New Note</span>
                        </button>
                    </div>
                </header>

                <div className="px-4 md:pr-10 md:pl-0 pb-2">
                    {/* AI Generate bar */}
                    <div className="mb-5">
                        <p className="text-sm text-gray-500 mb-3 hidden sm:block">
                            Describe what you want to write about, and let Flo's AI draft a note for you instantly.
                        </p>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/10 transition-all">
                            <img src={fAIAssistant} alt="AI" className="w-7 h-7 shrink-0" />
                            <input
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleGenerateFromPrompt()}
                                placeholder="Generate a note with FloAI..."
                                className="flex-1 h-10 sm:h-14 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerateFromPrompt}
                                disabled={!prompt.trim() || promptLoading}
                                className="flex items-center gap-2.5 bg-primary disabled:bg-bg-app text-text-primary disabled:text-gray-400 px-3.5 py-3 rounded-xl text-xs font-medium transition-colors shrink-0"
                            >
                                {promptLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                <span className="hidden sm:inline">{promptLoading ? 'Generating...' : 'Generate'}</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Upload zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); if (e.dataTransfer.types.includes('Files')) setIsDraggingFile(true); }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDraggingFile(false); const f = e.dataTransfer.files?.[0]; if (f) handleUploadFile(f); }}
                        className={`mb-5 flex items-center gap-3 bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200
                            ${isDraggingFile
                                ? 'border-secondary bg-secondary/5 shadow-md scale-[1.01]'
                                : uploadStatus === 'generating'
                                    ? 'border-primary/30 bg-primary/5'
                                    : 'border-dashed border-gray-200 hover:border-primary/40 hover:bg-gray-50/50'
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleUploadFile(f); if (fileInputRef.current) fileInputRef.current.value = ''; } }}
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isDraggingFile ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {uploadStatus === 'generating'
                                ? <Loader2 size={15} className="animate-spin text-secondary" />
                                : <CloudUpload size={15} />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 font-normal">
                                {uploadStatus === 'generating'
                                    ? 'Running AI Magic Summary...'
                                    : isDraggingFile
                                        ? 'Drop to generate summary!'
                                        : 'Upload PDF, Word or Text file to generate a magic summary'}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary shrink-0">
                            <Sparkles size={12} />
                            <span className="hidden sm:inline">Magic Summary</span>
                        </div>
                    </div>

                    {/* AI Summary preview banner */}
                    <AnimatePresence>
                        {uploadStatus === 'preview' && summaryPreview && (
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="mb-5 bg-white border border-primary/30 rounded-xl px-5 py-4 flex items-start gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">✨ Magic Summary Ready</p>
                                    <p className="text-sm font-medium text-gray-800 truncate">{summaryPreview.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{summaryPreview.preview}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={handleAddSummaryToNotes}
                                        className="px-3 py-1.5 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Add to Notes
                                    </button>
                                    <button
                                        onClick={() => { setUploadStatus('idle'); setSummaryPreview(null); }}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filter row */}
                    <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all w-52"
                            />
                        </div>

                        {/* Category chips */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === null
                                    ? 'bg-primary/15 text-secondary'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white'}`}
                            >
                                All
                            </button>
                            {availableCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat
                                        ? 'bg-primary/15 text-secondary'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                            <span className="ml-2 text-xs text-gray-400 font-medium">{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Notes Grid */}
                    {filteredNotes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200"
                        >
                            <p className="text-sm text-gray-400 font-medium">No notes found. Create one or adjust your filters.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 pb-8">
                            <AnimatePresence>
                                {filteredNotes.map((note, idx) => (
                                    <motion.div
                                        key={note.id}
                                        layout
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.04 }}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <NoteCard
                                            id={note.id}
                                            title={note.title}
                                            preview={note.preview}
                                            timestamp={note.timestamp}
                                            category={note.category}
                                            onClick={() => handleOpenEditNote(note.id)}
                                            onDragStart={handleDragStart}
                                            onGenerateFlashcard={(id) => {
                                                setFlashcardNoteId(id);
                                                setIsFlashcardOpen(true);
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating AI */}
            <FloatingAIButton onClick={() => setIsChatOpen(true)} />

            {/* Modals */}
            <AddNoteModal
                isOpen={isAddNoteModalOpen}
                onClose={() => {
                    setIsAddNoteModalOpen(false);
                    setTimeout(() => setEditingNoteId(null), 300);
                }}
                onSave={handleSaveNote}
                initialTitle={editingNote?.title}
                initialPreview={editingNote?.preview}
                initialCategory={editingNote?.category}
                availableCategories={availableCategories}
            />

            <AIChatPanel
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />

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
        </DashboardLayout>
    );
};

export default Notes;

