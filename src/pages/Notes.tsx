import { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import DashboardLayout from '../ui/DashboardLayout';
import HeaderAction from '../components/notes/HeaderAction';
import NoteCard from '../components/notes/NoteCard';
import FloatingAIButton from '../components/common/FloatingAIButton';
import AddNoteModal from '../components/notes/AddNoteModal';
import AIChatPanel from '../components/common/AIChatPanel';

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
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // Upload & Summary Preview State
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'generating' | 'preview'>('idle');
    const [summaryPreview, setSummaryPreview] = useState<{ fileName: string, title: string, preview: string, category: string } | null>(null);

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

    const handleUploadFile = (file: File) => {
        setUploadStatus('generating');

        // Simulate AI generation delay
        setTimeout(() => {
            setSummaryPreview({
                fileName: file.name,
                title: `✨ Summary: ${file.name.replace(/\.[^/.]+$/, "")}`, // Remove extension
                preview: `AI generated summary for the uploaded document. The document covers fundamental concepts and key takeaways about ${file.name}. It highlights the core ideas and provides a structured overview.`,
                category: "AI Summary"
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
                timestamp: "Just now",
                category: summaryPreview.category
            };
            setNotes([newNote, ...notes]);
            setUploadStatus('idle');
            setSummaryPreview(null);
        }
    };

    const handleCancelSummary = () => {
        setUploadStatus('idle');
        setSummaryPreview(null);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: number) => {
        e.dataTransfer.setData('text/plain', noteId.toString());
    };

    const handleDragEnd = () => {
        setIsDragOverDropzone(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
        setIsDragOverDropzone(true);
    };

    const handleDragLeave = () => {
        setIsDragOverDropzone(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const noteId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(noteId)) {
            setNotes(notes.filter(n => n.id !== noteId));
        }
        setIsDragOverDropzone(false);
    };

    const editingNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : null;

    return (
        <DashboardLayout>
            <div className="p-8 lg:p-12 animate-in fade-in duration-500">
                <div className="max-w-[1400px] mx-auto pb-24">

                    {/* Header Action Section */}
                    <HeaderAction
                        onAddNote={handleOpenAddNote}
                        onUploadFile={handleUploadFile}
                    />

                    {/* AI Summary Processing & Preview Section */}
                    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${uploadStatus === 'idle' ? 'max-h-0 opacity-0 mb-0' : 'max-h-[800px] opacity-100 mb-10'}`}>
                        {uploadStatus === 'generating' && (
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center justify-center space-x-4">
                                <div className="w-6 h-6 border-4 border-slate-200 border-t-secondary rounded-full animate-spin"></div>
                                <span className="text-slate-600 font-bold tracking-wide animate-pulse">Running AI Magic Summary...</span>
                            </div>
                        )}

                        {uploadStatus === 'preview' && summaryPreview && (
                            <div className="bg-gradient-to-br from-[#FFFDF5] to-white rounded-[2.5rem] p-8 md:p-10 border border-primary/20 shadow-[0_12px_40px_rgba(255,212,0,0.1)] relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            </div>
                                            <span className="text-secondary font-extrabold text-sm uppercase tracking-wider">Magic Summary Ready</span>
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-text-primary tracking-tight mb-4">{summaryPreview.title}</h3>
                                        <p className="text-slate-600 text-lg leading-relaxed font-medium mb-6">
                                            {summaryPreview.preview}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <button
                                                onClick={handleAddSummaryToNotes}
                                                className="bg-primary text-text-primary px-8 py-3.5 rounded-full font-bold shadow-[0_4px_15px_rgba(255,212,0,0.3)] hover:shadow-[0_8px_25px_rgba(255,212,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                                            >
                                                Add to Notes
                                            </button>
                                            <button
                                                onClick={handleCancelSummary}
                                                className="bg-white text-slate-500 border border-slate-200 px-8 py-3.5 rounded-full font-bold hover:bg-slate-50 transition-all duration-300"
                                            >
                                                Discard
                                            </button>
                                        </div>
                                    </div>

                                    {/* Document Info Card */}
                                    <div className="w-full md:w-72 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-shrink-0">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="bg-slate-50 p-3 rounded-full text-slate-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Source File</p>
                                                <p className="text-sm font-semibold text-text-primary truncate">{summaryPreview.fileName}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-50">
                                            <p className="text-xs text-slate-500">Category</p>
                                            <p className="text-sm font-bold text-text-primary mt-0.5">{summaryPreview.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search and Filter Section */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-text-primary text-sm rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all shadow-sm placeholder:text-slate-400"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 relative">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === null
                                    ? 'bg-primary text-text-primary shadow-sm'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                All Notes
                            </button>
                            {availableCategories.slice(0, 4).map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === category
                                        ? 'bg-text-primary text-white shadow-sm'
                                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}

                            {/* Overflow Categories */}
                            {availableCategories.length > 4 && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center space-x-1 ${selectedCategory && availableCategories.indexOf(selectedCategory) >= 4
                                            ? 'bg-text-primary text-white shadow-sm'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>
                                            {selectedCategory && availableCategories.indexOf(selectedCategory) >= 4
                                                ? selectedCategory
                                                : `+${availableCategories.length - 4} More`}
                                        </span>
                                        <svg className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isCategoryDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsCategoryDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {availableCategories.slice(4).map(category => (
                                                    <button
                                                        key={category}
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setIsCategoryDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 ${selectedCategory === category ? 'text-primary bg-primary/5' : 'text-text-secondary'
                                                            }`}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History Notes Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Recent Notes</h2>
                            <div className="flex items-center space-x-3">
                                {/* Trash Dropzone (Always visible) */}
                                <div
                                    className={`px-4 py-1.5 rounded-full flex items-center space-x-2 transition-all duration-300
                                        ${isDragOverDropzone
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                                            : 'bg-white text-slate-400 border border-slate-200 hover:border-red-200 hover:text-red-400'
                                        }
                                    `}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <Trash2 size={16} className={isDragOverDropzone ? 'animate-bounce' : ''} />
                                    <span className="text-sm font-bold opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto overflow-hidden transition-all hidden md:block md:w-auto md:opacity-100">Drop to Delete</span>
                                </div>
                                <span className="text-sm font-bold text-slate-400 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 transition-all duration-300">
                                    {filteredNotes.length} items
                                </span>
                            </div>
                        </div>

                        {filteredNotes.length === 0 ? (
                            <div className="text-center py-20 text-text-secondary bg-white rounded-[2rem] border border-slate-100 border-dashed animate-in zoom-in-95 duration-300">
                                <p className="text-lg">No notes found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                                {filteredNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                                        style={{ animationDelay: `${notes.findIndex(n => n.id === note.id) * 50}ms` }}
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
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            </div>

            {/* Floating AI Assistant */}
            <FloatingAIButton onClick={() => setIsChatOpen(true)} />

            {/* Modals & Panels */}
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
        </DashboardLayout>
    );
};

export default Notes;
