import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                blockquote: false,
                horizontalRule: false,
                strike: false,
                code: false,
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing...',
                emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:text-slate-300 before:absolute before:pointer-events-none'
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html === '<p></p>' ? '' : html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-sm sm:prose-base focus:outline-none min-h-[50vh] max-w-none text-text-secondary prose-p:leading-relaxed prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-dark w-full px-2',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all duration-300">
            {/* Toolbar - Sticky at Top */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm sticky top-0 z-10 transition-colors group-focus-within:bg-slate-50">
                <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200/60 shadow-sm">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded-md transition-all ${editor.isActive('bold') ? 'bg-primary/10 text-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        title="Bold"
                    >
                        <Bold size={16} strokeWidth={editor.isActive('bold') ? 2.5 : 2} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded-md transition-all ml-0.5 ${editor.isActive('italic') ? 'bg-primary/10 text-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        title="Italic"
                    >
                        <Italic size={16} strokeWidth={editor.isActive('italic') ? 2.5 : 2} />
                    </button>
                </div>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200/60 shadow-sm">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1.5 rounded-md transition-all ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        title="Bullet List"
                    >
                        <List size={16} strokeWidth={editor.isActive('bulletList') ? 2.5 : 2} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-1.5 rounded-md transition-all ml-0.5 ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        title="Numbered List"
                    >
                        <ListOrdered size={16} strokeWidth={editor.isActive('orderedList') ? 2.5 : 2} />
                    </button>
                </div>
            </div>

            {/* Editor Content Area */}
            <div
                className="flex-1 overflow-y-auto cursor-text p-6 bg-white"
                onClick={() => editor.commands.focus()}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
