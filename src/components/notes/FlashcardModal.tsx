import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, RotateCcw, CheckCircle2, XCircle, Trophy } from 'lucide-react';

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

const CARD_COUNT_OPTIONS = [3, 4, 5, 6, 7, 8];

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
            }, 270);
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
            }, 270);
        }
    }, [currentIndex, isAnimating]);

    const markCard = (rating: 'known' | 'learning') => {
        const updated = flashcards.map((c, i) => i === currentIndex ? { ...c, status: rating } : c);
        setFlashcards(updated);
        const allAnswered = updated.every(c => c.status !== null);
        if (allAnswered) setTimeout(() => setStatus('done'), 400);
        else goToNext();
    };

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



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

            <div className="relative bg-bg-app rounded-lg shadow-xl w-full max-w-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-text-primary">Flashcards</h2>
                        <p className="text-sm text-text-secondary truncate max-w-[280px]">{noteTitle}</p>
                    </div>
                    <button onClick={handleClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:bg-gray-100 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* ── CONFIG ── */}
                {status === 'config' && (
                    <div className="px-6 pb-6 pt-4">
                        <p className="text-sm text-text-secondary mb-5">
                            Turn your notes into smart, bite-sized flashcards — powered by FloAI. Choose how many cards to generate.
                        </p>

                        <label className="block text-sm font-medium text-text-primary mb-2">Number of Cards</label>
                        <div className="grid grid-cols-6 gap-2 mb-3">
                            {CARD_COUNT_OPTIONS.map(n => (
                                <button
                                    key={n}
                                    onClick={() => setCardCount(n)}
                                    className={`py-2.5 rounded-md text-sm font-medium transition-all duration-150
                                        ${cardCount === n
                                            ? 'bg-primary text-text-primary'
                                            : 'bg-white text-text-secondary border border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-text-secondary mb-5">
                            Selected: <span className="text-text-primary font-semibold">{cardCount} cards</span>
                        </p>

                        {/* Hint */}
                        <div className="mb-5 text-sm text-text-secondary space-y-2">
                            <p className="font-medium text-text-primary mb-1">How to study</p>
                            <p>• Click a card to reveal the answer</p>
                            <p>• <kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs">Space</kbd> to flip · <kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs">←</kbd><kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs">→</kbd> to navigate</p>
                            <p>• Rate each card as <span className="text-emerald-500 font-medium">Got it</span> or <span className="text-orange-400 font-medium">Still learning</span></p>
                        </div>

                        <button
                            onClick={handleGenerate}
                            className="w-full bg-linear-to-t from-primary to-primary/80 cursor-pointer text-text-primary text-sm font-normal py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            Generate Flashcards
                        </button>
                    </div>
                )}

                {/* ── GENERATING ── */}
                {status === 'generating' && (
                    <div className="px-6 py-14 flex flex-col items-center justify-center text-center gap-3">
                        <div className="relative">
                            <div className="w-14 h-14 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
                            <Sparkles size={18} className="absolute inset-0 m-auto text-secondary" />
                        </div>
                        <p className="text-base font-medium text-text-primary">Creating {cardCount} flashcards...</p>
                        <p className="text-sm text-text-secondary">AI is analyzing your note.</p>
                    </div>
                )}

                {/* ── VIEWING ── */}
                {status === 'viewing' && flashcards.length > 0 && (
                    <div className="px-6 pb-5 pt-4">
                        {/* Status row + dots (no progress bar) */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-text-primary font-medium">
                                    {currentIndex + 1} of {flashcards.length}
                                </span>
                            </div>
                            {/* Status dots */}
                            <div className="flex gap-1">
                                {flashcards.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setIsFlipped(false); setCurrentIndex(i); }}
                                        className={`h-1.5 flex-1 rounded-full transition-all duration-200
                                            ${i === currentIndex ? 'bg-secondary' :
                                                c.status === 'known' ? 'bg-emerald-400' :
                                                    c.status === 'learning' ? 'bg-orange-400' : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Flip Card */}
                        <div
                            className={`relative h-60 cursor-pointer mb-4 transition-all duration-250
                                ${slideDir === 'left' ? '-translate-x-6 opacity-0' : ''}
                                ${slideDir === 'right' ? 'translate-x-6 opacity-0' : ''}
                                ${slideDir === null ? 'translate-x-0 opacity-100' : ''}`}
                            style={{ perspective: '1000px' }}
                            onClick={() => setIsFlipped(f => !f)}
                        >
                            <div
                                className="relative w-full h-full transition-transform duration-450"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                }}
                            >
                                {/* Front */}
                                <div
                                    className="absolute inset-0 bg-white border border-gray-100 rounded-xl flex flex-col items-center justify-center px-6 py-5 text-center select-none"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <span className="text-sm font-medium text-text-primary mb-3">
                                        Question
                                    </span>
                                    <p className="text-text-primary font-medium text-base leading-relaxed line-clamp-4">
                                        {flashcards[currentIndex].question}
                                    </p>
                                    <p className="text-text-secondary text-xs mt-5">
                                        Click to reveal the answer
                                    </p>
                                </div>

                                {/* Back */}
                                <div
                                    className="absolute inset-0 bg-primary/5 border border-primary/15 rounded-xl flex flex-col items-center justify-center px-6 py-5 text-center select-none"
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <span className="text-xs font-medium text-secondary bg-primary/10 px-2.5 py-0.5 rounded-full mb-3">
                                        Answer
                                    </span>
                                    <p className="text-text-primary font-normal text-base leading-relaxed line-clamp-5">
                                        {flashcards[currentIndex].answer}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Self-eval buttons */}
                        <div className={`flex gap-2 mb-4 transition-all duration-250 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5 pointer-events-none'}`}>
                            <button
                                onClick={() => markCard('learning')}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-500 text-sm font-medium hover:bg-orange-100 transition-colors"
                            >
                                <XCircle size={15} />
                                Still Learning
                            </button>
                            <button
                                onClick={() => markCard('known')}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-colors"
                            >
                                <CheckCircle2 size={15} />
                                Got It!
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={goToPrev}
                                disabled={currentIndex === 0}
                                className="flex items-center cursor-pointer gap-1 px-4 py-2.5 rounded-lg border border-gray-200 text-text-secondary text-sm font-medium bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </button>

                            <button
                                onClick={() => { setStatus('config'); setFlashcards([]); setCurrentIndex(0); setIsFlipped(false); }}
                                className="flex items-center gap-1 cursor-pointer  text-text-secondary hover:text-text-primary text-sm transition-colors"
                            >
                                <RotateCcw size={13} />
                                Regenerate
                            </button>

                            <button
                                onClick={goToNext}
                                disabled={currentIndex === flashcards.length - 1}
                                className="flex items-center cursor-pointer gap-1 px-4 py-2.5 rounded-lg bg-primary text-text-primary text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── DONE ── */}
                {status === 'done' && (
                    <div className="px-5 py-8 flex flex-col  items-center text-center">
                        <div className="w-14 h-14 flex items-center justify-center mb-4">
                            <Trophy size={40} className="text-secondary" />
                        </div>
                        <h3 className="text-base font-medium text-text-primary mb-1">All done, Wandi Der!</h3>
                        <p className="text-sm text-text-secondary mb-6">
                            You reviewed all {flashcards.length} cards. Great session!
                        </p>

                        {/* Score cards */}
                        <div className="w-full grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-500 mb-0.5">{knownCount}</p>
                                <p className="text-[11px] font-medium text-emerald-600">Got It</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-orange-400 mb-0.5">{learningCount}</p>
                                <p className="text-[11px] font-medium text-orange-500">Still Learning</p>
                            </div>
                        </div>

                        {/* Mastery bar */}
                        <div className="w-full bg-white rounded h-2 overflow-hidden mb-1.5">
                            <div
                                className="h-full bg-emerald-400 rounded transition-all duration-700"
                                style={{ width: `${flashcards.length > 0 ? (knownCount / flashcards.length) * 100 : 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-text-primary mb-6 mt-2">
                            Mastery score: <span className="text-emerald-500 font-semibold">
                                {Math.round(flashcards.length > 0 ? (knownCount / flashcards.length) * 100 : 0)}%
                            </span>
                        </p>

                        <div className="flex gap-2.5 w-full">
                            <button
                                onClick={() => { setStatus('config'); setFlashcards([]); setCurrentIndex(0); }}
                                className="flex-1 py-3 cursor-pointer rounded-lg border border-gray-200 text-text-secondary text-xs font-normal bg-white transition-colors"
                            >
                                New Session
                            </button>
                            <button
                                onClick={() => {
                                    const retryCards = flashcards.filter(c => c.status === 'learning').map(c => ({ ...c, status: null as null }));
                                    if (retryCards.length > 0) {
                                        setFlashcards(retryCards);
                                        setCurrentIndex(0);
                                        setIsFlipped(false);
                                        setStatus('viewing');
                                    }
                                }}
                                disabled={learningCount === 0}
                                className="flex-1 py-3 cursor-pointer rounded-lg bg-primary text-text-primary text-xs font-normal hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Retry Missed ({learningCount})
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashcardModal;
