import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Tag, Plus, Check } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, preview: string, category: string, description?: string) => void;
    initialTitle?: string;
    initialDescription?: string;
    initialPreview?: string;
    initialCategory?: string;
    availableCategories: string[];
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialTitle = '',
    initialDescription = '',
    initialPreview = '',
    initialCategory = '',
    availableCategories
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [preview, setPreview] = useState(initialPreview);
    const [category, setCategory] = useState(initialCategory);

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update state when modal opens with new initial values
    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setDescription(initialDescription);
            setPreview(initialPreview);
            setCategory(initialCategory);
            setIsDropdownOpen(false);
            setCategorySearch('');
        }
    }, [isOpen, initialTitle, initialDescription, initialPreview, initialCategory]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSaveAndClose = () => {
        // Only save if there's actual content
        if (title.trim() || preview.trim()) {
            // Provide default title if empty but has content
            const finalTitle = title.trim() || 'Untitled Note';
            onSave(finalTitle, preview, category.trim() || 'General', description.trim());
        }
        onClose();
    };

    const filteredCategories = availableCategories.filter(c =>
        c.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const isExactMatch = availableCategories.some(c => c.toLowerCase() === categorySearch.trim().toLowerCase());
    const canCreateNew = categorySearch.trim().length > 0 && !isExactMatch;

    const handleSelectCategory = (cat: string) => {
        setCategory(cat);
        setIsDropdownOpen(false);
        setCategorySearch('');
    };

    // We keep it mounted to allow the CSS transition to play out smoothly
    // but disable pointer events and hide visually when closed
    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleSaveAndClose}
            />

            {/* Slide-over panel */}
            <div
                className={`absolute inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl border-l border-slate-100 flex flex-col
                transform transition-transform duration-500 ease-out will-change-transform
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleSaveAndClose}
                            className="text-text-secondary hover:bg-bg-app p-1.5 rounded-lg transition-colors flex items-center justify-center -ml-2"
                        >
                            <ChevronRight size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-text-primary capitalize">
                            {initialTitle ? 'Edit Note' : 'New Note'}
                        </h2>
                    </div>
                    <span className="text-sm font-medium text-slate-400 flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <Check size={14} className="text-secondary" />
                        <span>Auto-saved</span>
                    </span>
                </div>

                <div className="flex-none flex flex-col px-8 pt-8 pb-4 space-y-6 z-10">
                    {/* Category Selector */}
                    <div className="relative flex items-center" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-semibold text-text-secondary transition-colors"
                        >
                            <Tag size={14} className={category ? "text-primary" : ""} />
                            <span>{category || 'Add Category...'}</span>
                        </button>

                        {/* Animated Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2 border-b border-slate-50 relative">
                                    <input
                                        type="text"
                                        placeholder="Search or create..."
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="w-full bg-slate-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-primary placeholder:text-slate-400"
                                        autoFocus
                                    />
                                </div>
                                <div className="max-h-[200px] overflow-y-auto p-2">
                                    {canCreateNew && (
                                        <button
                                            onClick={() => handleSelectCategory(categorySearch.trim())}
                                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-text-primary hover:bg-primary/10 transition-colors text-left font-medium"
                                        >
                                            <Plus size={14} className="text-primary" />
                                            <span className="truncate">Create "{categorySearch.trim()}"</span>
                                        </button>
                                    )}

                                    {filteredCategories.length > 0 ? (
                                        <div className="space-y-0.5 mt-1">
                                            {filteredCategories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => handleSelectCategory(cat)}
                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-text-primary hover:bg-slate-50 transition-colors text-left"
                                                >
                                                    <span className="truncate flex-1 font-medium">{cat}</span>
                                                    {category === cat && <Check size={14} className="text-primary shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    ) : !canCreateNew && (
                                        <div className="px-3 py-4 text-center text-sm text-slate-400">
                                            No categories found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note Title"
                        className="w-full text-4xl font-bold text-text-primary placeholder:text-slate-300 bg-transparent focus:outline-none transition-all flex-none"
                    />
                </div>
                <div className="flex-1 w-full min-h-[400px] px-8 pb-8 flex flex-col">
                    <RichTextEditor
                        content={preview}
                        onChange={(newContent) => setPreview(newContent)}
                        placeholder="Start writing..."
                    />
                </div>
            </div>
        </div>
    );
};

export default AddNoteModal;
