import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useState } from 'react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
  initialValue?: string;
  onChange: (html: string) => void;
  className?: string;
}

export const TiptapEditor = ({ initialValue = '', onChange, className }: TiptapEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLink, setShowLink] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Underline,
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: { class: 'text-xs min-h-[52px] px-3 py-2 focus:outline-none' },
      handleKeyDown: (_view, event) => {
        // Keep announcement bar to a single line
        if (event.key === 'Enter') { event.preventDefault(); return true; }
        return false;
      },
    },
  });

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
    setLinkUrl('');
    setShowLink(false);
  };

  const handleLinkClick = () => {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      setLinkUrl(editor.getAttributes('link').href ?? '');
      setShowLink(true);
    }
  };

  if (!editor) return null;

  return (
    <div className={cn('border border-input rounded-sm overflow-hidden bg-background', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-input bg-muted/30">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          className="h-6 w-6 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-3 h-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          className="h-6 w-6 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-3 h-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
          className="h-6 w-6 p-0"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-3 h-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
          className="h-6 w-6 p-0"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-3 h-3" />
        </Button>

        <div className="w-px h-4 bg-border mx-0.5" />

        {showLink ? (
          <div className="flex gap-1 items-center flex-1">
            <input
              type="url"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="h-6 text-[11px] flex-1 border border-input rounded px-2 bg-background focus:outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                if (e.key === 'Escape') setShowLink(false);
              }}
              autoFocus
            />
            <Button type="button" size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={applyLink}>
              OK
            </Button>
            <Button type="button" size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowLink(false)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            variant={editor.isActive('link') ? 'secondary' : 'ghost'}
            className="h-6 w-6 p-0"
            onClick={handleLinkClick}
          >
            <LinkIcon className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
};
