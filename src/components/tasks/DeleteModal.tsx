import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl relative"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this task? This action cannot be undone.
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { onConfirm(); onClose(); }}
                                    className="flex-1 py-2.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
