import { useRef, useState } from 'react';
import { CloudUpload, Plus, Sparkles } from 'lucide-react';

interface HeaderActionProps {
    onAddNote: () => void;
    onUploadFile: (file: File) => void;
}

const HeaderAction = ({ onAddNote, onUploadFile }: HeaderActionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUploadFile(file);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Only accept files, not dragged notes
        const hasFiles = e.dataTransfer.types.includes('Files');
        if (hasFiles) {
            setIsDraggingFile(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            onUploadFile(file);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 2xl:gap-10 mb-10 lg:mb-14 2xl:mb-16">
            {/* Upload & AI Summary Card */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/80 rounded-[2.5rem] p-8 lg:p-10 2xl:p-12 flex flex-col items-center justify-center min-h-[200px] 2xl:min-h-[240px] group transition-all duration-500 cursor-pointer overflow-hidden shadow-sm
                    ${isDraggingFile
                        ? 'border-secondary bg-secondary/5 shadow-[0_8px_30px_rgba(255,140,0,0.15)] scale-[1.02]'
                        : 'hover:border-primary/60 hover:shadow-[0_20px_40px_-15px_rgba(255,212,0,0.15)] hover:-translate-y-1'
                    }`}
            >
                {/* Visual feedback overlay when dragging in */}
                {isDraggingFile && (
                    <div className="absolute inset-0 bg-secondary/10 flex flex-col items-center justify-center z-20 backdrop-blur-[2px] transition-all duration-300">
                        <CloudUpload size={56} className="text-secondary animate-bounce mb-4 drop-shadow-md" />
                        <span className="text-secondary font-bold text-lg tracking-wide drop-shadow-sm">Drop file to magically jumpstart!</span>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                />
                <div className={`absolute top-6 right-6 bg-gradient-to-r from-primary/20 to-primary/10 text-text-primary text-[11px] uppercase tracking-wider font-extrabold px-4 py-2 rounded-full flex items-center space-x-2 shadow-sm border border-primary/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-md ${isDraggingFile ? 'opacity-0' : 'opacity-100'}`}>
                    <Sparkles size={14} className="text-secondary" />
                    <span>Magic Summary</span>
                </div>
                <div className={`bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-5 rounded-full mb-5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 group-hover:scale-110 ${isDraggingFile ? 'opacity-0 scale-90' : 'opacity-100'}`}>
                    <CloudUpload className="text-slate-400 group-hover:text-secondary transition-colors duration-500" size={38} strokeWidth={1.5} />
                </div>
                <p className={`text-text-primary text-xl 2xl:text-2xl font-extrabold tracking-tight transition-all duration-500 ${isDraggingFile ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>Upload Document</p>
                <p className={`text-sm 2xl:text-base text-slate-400 mt-1.5 font-medium transition-all duration-500 delay-75 ${isDraggingFile ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>Drag & Drop PDF, Word or Text files</p>
            </div>

            {/* Add New Note Card */}
            <div
                onClick={onAddNote}
                className="bg-white rounded-[2.5rem] p-8 lg:p-10 2xl:p-12 flex flex-col items-end justify-between min-h-[200px] 2xl:min-h-[240px] group hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(255,212,0,0.15)] transition-all duration-500 cursor-pointer overflow-hidden relative border border-slate-200/80 shadow-sm"
            >
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 group-hover:opacity-100 opacity-60 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-2xl -ml-20 -mb-20 group-hover:opacity-100 opacity-40 transition-opacity duration-500"></div>

                <div className="w-full flex justify-between items-start z-10">
                    <div>
                        <h3 className="text-3xl 2xl:text-4xl font-extrabold text-text-primary tracking-tight group-hover:text-secondary transition-colors duration-300">Quick Note</h3>
                        <p className="text-sm 2xl:text-base text-slate-500 font-medium mt-2">Jot down thoughts instantly</p>
                    </div>
                </div>

                <div className="relative z-10 w-full flex items-end justify-end mt-6">
                    <div className="bg-primary text-text-primary font-bold px-7 py-4 rounded-full flex items-center space-x-3 group-hover:bg-text-primary group-hover:text-white transition-all duration-500 shadow-[0_8px_20px_rgba(255,212,0,0.2)] group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:scale-105">
                        <span className="text-[15px] 2xl:text-base tracking-wide">Write Now</span>
                        <div className="bg-white/50 group-hover:bg-white/20 p-1.5 rounded-full transition-colors duration-300">
                            <Plus size={18} strokeWidth={3} className="text-current" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderAction;
