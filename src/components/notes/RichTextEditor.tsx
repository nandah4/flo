import { useEffect } from 'react';
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
                emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:text-sm before:text-text-secondary before:font-normal! before:absolute before:pointer-events-none'
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html === '<p></p>' ? '' : html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-sm focus:outline-none min-h-[50vh] max-w-none text-xs sm:text-sm text-text-secondary prose-p:leading-relaxed prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-dark w-full px-2',
            },
        },
    });

    // Sync content from parent when it changes (e.g. when opening a different note)
    useEffect(() => {
        if (!editor) return;
        const currentHtml = editor.getHTML();
        const incomingContent = content || '';
        if (currentHtml !== incomingContent) {
            editor.commands.setContent(incomingContent);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col bg-white border border-gray-200 overflow-hidden rounded-lg">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-primary/10 text-secondary' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                    title="Bold"
                >
                    <Bold size={14} strokeWidth={editor.isActive('bold') ? 2.5 : 2} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-primary/10 text-secondary' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                    title="Italic"
                >
                    <Italic size={14} strokeWidth={editor.isActive('italic') ? 2.5 : 2} />
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-primary/10 text-secondary' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                    title="Bullet List"
                >
                    <List size={14} strokeWidth={editor.isActive('bulletList') ? 2.5 : 2} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-primary/10 text-secondary' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                    title="Numbered List"
                >
                    <ListOrdered size={14} strokeWidth={editor.isActive('orderedList') ? 2.5 : 2} />
                </button>
            </div>

            {/* Editor Content Area */}
            <div
                className="flex-1 overflow-y-auto cursor-text p-2 bg-white"
                onClick={() => editor.commands.focus()}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
