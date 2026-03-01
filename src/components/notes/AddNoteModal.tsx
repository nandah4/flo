import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlignLeft, Tag, Plus, Check } from 'lucide-react';
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

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSave = () => {
        if (title.trim() || preview.trim()) {
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={handleSave}
                    />

                    {/* Drawer — slides from right on md+, centered modal on mobile */}
                    <motion.div
                        key="drawer"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className={[
                            'fixed z-50 bg-bg-app shadow-2xl flex flex-col mr-2 my-2',
                            'md:inset-y-0 md:right-0 md:w-[560px] md:rounded-xl',
                            'max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2 max-md:rounded-xl max-md:max-h-[90vh]',
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
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable form body */}
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-5 px-6 py-4">

                                {/* Title */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2">
                                        <AlignLeft size={12} /> Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Calculus III Notes"
                                        className="w-full text-xs text-gray-700 font-normal placeholder:text-gray-300 bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2">
                                        <Tag size={12} /> Category
                                    </label>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`w-full text-left text-xs font-normal bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all flex items-center justify-between
                                                ${category ? 'text-gray-700' : 'text-gray-300'}`}
                                        >
                                            <span>{category || 'Select or create a category...'}</span>
                                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                                <div className="p-2 border-b border-gray-50">
                                                    <input
                                                        type="text"
                                                        placeholder="Search or create..."
                                                        value={categorySearch}
                                                        onChange={e => setCategorySearch(e.target.value)}
                                                        className="w-full bg-gray-50 rounded-lg px-3 py-2 text-xs focus:outline-none text-gray-700 placeholder:text-gray-400"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="max-h-[180px] overflow-y-auto p-1.5">
                                                    {canCreateNew && (
                                                        <button
                                                            onClick={() => handleSelectCategory(categorySearch.trim())}
                                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-primary/5 transition-colors text-left font-medium"
                                                        >
                                                            <Plus size={13} className="text-primary" />
                                                            <span>Create "{categorySearch.trim()}"</span>
                                                        </button>
                                                    )}
                                                    {filteredCategories.map(cat => (
                                                        <button
                                                            key={cat}
                                                            onClick={() => handleSelectCategory(cat)}
                                                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                                        >
                                                            <span className="font-normal">{cat}</span>
                                                            {category === cat && <Check size={13} className="text-primary shrink-0" />}
                                                        </button>
                                                    ))}
                                                    {filteredCategories.length === 0 && !canCreateNew && (
                                                        <p className="px-3 py-3 text-center text-xs text-gray-400">No categories found</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content label */}
                                <div>
                                    <label className="text-sm font-medium text-text-primary tracking-wider mb-2 flex items-center gap-2">
                                        <AlignLeft size={12} /> Content
                                    </label>
                                </div>
                            </div>

                            {/* Rich text editor fills remaining space */}
                            <div className="flex-1 px-6 pb-4 min-h-[200px]">
                                <RichTextEditor
                                    content={preview}
                                    onChange={newContent => setPreview(newContent)}
                                    placeholder="Start writing your note..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto px-6 py-5 border-t border-gray-100 flex items-center gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-md border border-gray-200 text-sm font-normal text-gray-500 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="flex-1 py-2.5 rounded-md bg-linear-to-t from-primary to-primary/80 text-text-primary text-sm font-normal hover:opacity-90 transition-opacity"
                            >
                                {initialTitle ? 'Save Changes' : 'Add Note'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddNoteModal;
