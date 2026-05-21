import { type Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough,
  Link2, Unlink, List, ListOrdered, Code,
} from 'lucide-react';

interface TiptapToolbarProps {
  editor: Editor;
  showLists?: boolean;
}

export const TiptapToolbar = ({ editor, showLists = false }: TiptapToolbarProps) => {
  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt('Enter URL:', 'https://');
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const btn = (active: boolean) =>
    `w-6 h-6 flex items-center justify-center transition-colors rounded-sm ${
      active
        ? 'bg-foreground text-background'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
    }`;

  const sep = <span className="w-px h-3.5 bg-border mx-0.5 shrink-0" />;

  return (
    <div
      className="flex items-center flex-wrap gap-0.5 px-1.5 py-1 mb-1 border border-border bg-muted/10"
      onMouseDown={e => e.preventDefault()}
    >
      <button className={btn(editor.isActive('bold'))}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        title="Bold (Ctrl+B)"><Bold className="w-3 h-3" /></button>

      <button className={btn(editor.isActive('italic'))}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        title="Italic (Ctrl+I)"><Italic className="w-3 h-3" /></button>

      <button className={btn(editor.isActive('underline'))}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
        title="Underline (Ctrl+U)"><Underline className="w-3 h-3" /></button>

      <button className={btn(editor.isActive('strike'))}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        title="Strikethrough"><Strikethrough className="w-3 h-3" /></button>

      {sep}

      <button className={btn(editor.isActive('link'))}
        onMouseDown={handleLink}
        title={editor.isActive('link') ? 'Remove link' : 'Add link'}>
        {editor.isActive('link') ? <Unlink className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
      </button>

      {showLists && (
        <>
          {sep}
          <button className={btn(editor.isActive('bulletList'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
            title="Bullet list"><List className="w-3 h-3" /></button>

          <button className={btn(editor.isActive('orderedList'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
            title="Numbered list"><ListOrdered className="w-3 h-3" /></button>

          {sep}
          <button className={btn(editor.isActive('code'))}
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
            title="Inline code"><Code className="w-3 h-3" /></button>
        </>
      )}
    </div>
  );
};
