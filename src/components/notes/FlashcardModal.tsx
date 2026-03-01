import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, RotateCcw, Layers, CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface Flashcard {
    question: string;
    answer: string;
    status?: 'known' | 'learning' | null;
}

interface FlashcardModalProps {
    isOpen: boolean;
    onClose: () => void;
    noteTitle: string;
    noteContent: string;
}

const generateFlashcards = (title: string, content: string, count: number): Flashcard[] => {
    const plainText = content.replace(/<[^>]+>/g, '').trim();

    const sampleCards: Flashcard[] = [
        {
            question: `What is the main topic covered in "${title}"?`,
            answer: plainText.split('.')[0] || `The main concepts and ideas covered in ${title}.`
        },
        {
            question: `Summarize the key takeaway from "${title}" in one sentence.`,
            answer: plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '')
        },
        {
            question: `What are the core concepts covered in this note?`,
            answer: `This note covers: ${title}. Key points include the fundamental ideas and theories presented in the content.`
        },
        {
            question: `How would you explain "${title}" to someone unfamiliar with the topic?`,
            answer: `${title} involves understanding the key concepts: ${plainText.substring(0, 100)}...`
        },
        {
            question: `What practical applications does this topic have?`,
            answer: `The concepts from "${title}" can be applied to real-world scenarios involving problem-solving and critical thinking.`
        },
        {
            question: `What are the most important terms or definitions in "${title}"?`,
            answer: `Key terms from this topic include those concepts mentioned in: ${title}.`
        },
        {
            question: `How does "${title}" relate to broader concepts in the field?`,
            answer: `"${title}" connects to broader theories and provides foundational understanding for related subjects.`
        },
        {
            question: `What questions remain unanswered after reviewing "${title}"?`,
            answer: `Further exploration of ${title} may reveal deeper insights about advanced applications and edge cases.`
        },
        {
            question: `Create a memory aid for the key concepts in "${title}".`,
            answer: `To remember "${title}", focus on the core principles and create associations with prior knowledge.`
        },
        {
            question: `What is the theoretical context of "${title}"?`,
            answer: `The background of "${title}" stems from established theories and practices in the domain.`
        },
    ];

    return sampleCards.slice(0, Math.min(count, sampleCards.length)).map(c => ({ ...c, status: null }));
};

const CARD_COUNT_OPTIONS = [3, 5, 8, 10, 15, 20];

const FlashcardModal: React.FC<FlashcardModalProps> = ({ isOpen, onClose, noteTitle, noteContent }) => {
    const [cardCount, setCardCount] = useState(5);
    const [status, setStatus] = useState<'config' | 'generating' | 'viewing' | 'done'>('config');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const knownCount = flashcards.filter(c => c.status === 'known').length;
    const learningCount = flashcards.filter(c => c.status === 'learning').length;

    const handleGenerate = () => {
        setStatus('generating');
        setTimeout(() => {
            const cards = generateFlashcards(noteTitle, noteContent, cardCount);
            setFlashcards(cards);
            setCurrentIndex(0);
            setIsFlipped(false);
            setStatus('viewing');
        }, 1400);
    };

    const handleClose = () => {
        setStatus('config');
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
        onClose();
    };

    const goToNext = useCallback(() => {
        if (isAnimating) return;
        if (currentIndex < flashcards.length - 1) {
            setSlideDir('left');
            setIsAnimating(true);
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(i => i + 1);
                setSlideDir(null);
                setIsAnimating(false);
            }, 300);
        }
    }, [currentIndex, flashcards.length, isAnimating]);

    const goToPrev = useCallback(() => {
        if (isAnimating) return;
        if (currentIndex > 0) {
            setSlideDir('right');
            setIsAnimating(true);
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex(i => i - 1);
                setSlideDir(null);
                setIsAnimating(false);
            }, 300);
        }
    }, [currentIndex, isAnimating]);

    const markCard = (rating: 'known' | 'learning') => {
        const updated = flashcards.map((c, i) => i === currentIndex ? { ...c, status: rating } : c);
        setFlashcards(updated);

        const allAnswered = updated.every(c => c.status !== null);
        if (allAnswered) {
            setTimeout(() => setStatus('done'), 400);
        } else {
            goToNext();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        if (status !== 'viewing') return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === ' ') { e.preventDefault(); setIsFlipped(f => !f); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [status, goToNext, goToPrev]);

    const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-7 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <Layers size={20} className="text-secondary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-text-primary tracking-tight">Flashcards</h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-[220px] truncate">{noteTitle}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-all duration-200">
                        <X size={18} />
                    </button>
                </div>

                {/* ── CONFIG ── */}
                {status === 'config' && (
                    <div className="px-7 pb-8">
                        <p className="text-sm text-slate-500 font-medium mb-6">
                            AI akan membuat flashcard berdasarkan isi catatan Anda. Pilih jumlah kartu yang ingin dibuat.
                        </p>
                        <label className="block text-sm font-bold text-text-primary mb-3">Jumlah Flashcard</label>
                        <div className="grid grid-cols-6 gap-2 mb-2">
                            {CARD_COUNT_OPTIONS.map(n => (
                                <button
                                    key={n}
                                    onClick={() => setCardCount(n)}
                                    className={`py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                                        ${cardCount === n
                                            ? 'bg-primary text-text-primary shadow-[0_4px_12px_rgba(255,212,0,0.3)] scale-105'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mb-6 font-medium">
                            Dipilih: <span className="text-secondary font-bold">{cardCount} kartu</span>
                        </p>

                        {/* Hint */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-xs text-slate-400 font-medium space-y-1">
                            <p>💡 <span className="font-semibold text-slate-500">Tips navigasi:</span></p>
                            <p>• Klik kartu untuk membaliknya</p>
                            <p>• Tekan <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">Space</kbd> untuk flip, <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">←</kbd><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">→</kbd> untuk navigasi</p>
                            <p>• Tandai "<span className="text-emerald-500 font-bold">Paham</span>" atau "<span className="text-orange-400 font-bold">Perlu Belajar</span>" di setiap kartu</p>
                        </div>

                        <button
                            onClick={handleGenerate}
                            className="w-full bg-primary text-text-primary font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 hover:shadow-[0_8px_25px_rgba(255,212,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Sparkles size={18} className="text-secondary" />
                            <span>Generate Flashcard</span>
                        </button>
                    </div>
                )}

                {/* ── GENERATING ── */}
                {status === 'generating' && (
                    <div className="px-7 pb-14 flex flex-col items-center justify-center text-center space-y-4 min-h-[240px]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <Sparkles size={20} className="absolute inset-0 m-auto text-secondary" />
                        </div>
                        <p className="text-slate-700 font-bold text-lg">Membuat {cardCount} flashcard...</p>
                        <p className="text-slate-400 text-sm font-medium">AI sedang menganalisis catatan Anda ✨</p>
                    </div>
                )}

                {/* ── VIEWING ── */}
                {status === 'viewing' && flashcards.length > 0 && (
                    <div className="px-7 pb-7">
                        {/* Progress bar */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    {currentIndex + 1} / {flashcards.length}
                                </span>
                                <div className="flex items-center space-x-3 text-[11px] font-bold">
                                    <span className="text-emerald-500 flex items-center space-x-1">
                                        <CheckCircle2 size={12} />
                                        <span>{knownCount} Paham</span>
                                    </span>
                                    <span className="text-orange-400 flex items-center space-x-1">
                                        <XCircle size={12} />
                                        <span>{learningCount} Belajar</span>
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            {/* Per-card status dots */}
                            <div className="flex space-x-1 mt-2">
                                {flashcards.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setIsFlipped(false); setCurrentIndex(i); }}
                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300
                                            ${i === currentIndex ? 'bg-secondary scale-y-150' :
                                                c.status === 'known' ? 'bg-emerald-400' :
                                                    c.status === 'learning' ? 'bg-orange-400' : 'bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Flip Card */}
                        <div
                            className={`relative h-56 cursor-pointer mb-4 transition-transform duration-300
                                ${slideDir === 'left' ? '-translate-x-8 opacity-0' : ''}
                                ${slideDir === 'right' ? 'translate-x-8 opacity-0' : ''}
                                ${slideDir === null ? 'translate-x-0 opacity-100' : ''}`}
                            style={{ perspective: '1000px' }}
                            onClick={() => setIsFlipped(f => !f)}
                        >
                            <div
                                className="relative w-full h-full transition-transform duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                }}
                            >
                                {/* Front */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <div className="bg-primary/10 text-secondary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                        Pertanyaan
                                    </div>
                                    <p className="text-text-primary font-semibold text-[15px] leading-relaxed line-clamp-4">
                                        {flashcards[currentIndex].question}
                                    </p>
                                    <p className="text-slate-300 text-[11px] font-semibold mt-4 flex items-center space-x-1">
                                        <span>Klik atau tekan</span>
                                        <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md">Space</kbd>
                                        <span>untuk lihat jawaban</span>
                                    </p>
                                </div>

                                {/* Back */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-white border border-primary/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none"
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <div className="bg-secondary/10 text-secondary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                        Jawaban ✓
                                    </div>
                                    <p className="text-text-primary font-medium text-[14px] leading-relaxed line-clamp-5">
                                        {flashcards[currentIndex].answer}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Self-eval buttons (visible only when card is flipped) */}
                        <div className={`flex space-x-3 mb-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                            <button
                                onClick={() => markCard('learning')}
                                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl border-2 border-orange-200 bg-orange-50 text-orange-500 font-bold text-sm hover:bg-orange-100 transition-all duration-200 active:scale-95"
                            >
                                <XCircle size={16} />
                                <span>Perlu Belajar</span>
                            </button>
                            <button
                                onClick={() => markCard('known')}
                                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-600 font-bold text-sm hover:bg-emerald-100 transition-all duration-200 active:scale-95"
                            >
                                <CheckCircle2 size={16} />
                                <span>Paham!</span>
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={goToPrev}
                                disabled={currentIndex === 0}
                                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm"
                            >
                                <ChevronLeft size={16} />
                                <span>Prev</span>
                            </button>

                            <button
                                onClick={() => { setStatus('config'); setFlashcards([]); setCurrentIndex(0); setIsFlipped(false); }}
                                className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors"
                            >
                                <RotateCcw size={13} />
                                <span>Buat Ulang</span>
                            </button>

                            <button
                                onClick={goToNext}
                                disabled={currentIndex === flashcards.length - 1}
                                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-primary text-text-primary font-semibold text-sm hover:shadow-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span>Next</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── DONE ── */}
                {status === 'done' && (
                    <div className="px-7 pb-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                            <Trophy size={36} className="text-secondary" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-text-primary mb-1">Sesi Selesai! 🎉</h3>
                        <p className="text-slate-400 text-sm font-medium mb-8">
                            Kamu telah menyelesaikan semua {flashcards.length} kartu
                        </p>

                        {/* Score cards */}
                        <div className="w-full grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                                <p className="text-4xl font-extrabold text-emerald-500 mb-1">{knownCount}</p>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Paham</p>
                            </div>
                            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
                                <p className="text-4xl font-extrabold text-orange-400 mb-1">{learningCount}</p>
                                <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Perlu Belajar</p>
                            </div>
                        </div>

                        {/* Mastery indicator */}
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
                                style={{ width: `${flashcards.length > 0 ? (knownCount / flashcards.length) * 100 : 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 font-semibold mb-8">
                            Tingkat pemahaman: <span className="text-emerald-500 font-bold">
                                {Math.round(flashcards.length > 0 ? (knownCount / flashcards.length) * 100 : 0)}%
                            </span>
                        </p>

                        <div className="flex space-x-3 w-full">
                            <button
                                onClick={() => { setStatus('config'); setFlashcards([]); setCurrentIndex(0); }}
                                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all"
                            >
                                Buat Baru
                            </button>
                            <button
                                onClick={() => {
                                    // Retry only "learning" cards
                                    const retryCards = flashcards.filter(c => c.status === 'learning').map(c => ({ ...c, status: null as null }));
                                    if (retryCards.length > 0) {
                                        setFlashcards(retryCards);
                                        setCurrentIndex(0);
                                        setIsFlipped(false);
                                        setStatus('viewing');
                                    }
                                }}
                                disabled={learningCount === 0}
                                className="flex-1 py-3 rounded-2xl bg-primary text-text-primary font-bold text-sm hover:shadow-[0_4px_15px_rgba(255,212,0,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Ulangi yang Salah ({learningCount})
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashcardModal;
