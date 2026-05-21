import { type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Italic, Underline, Strikethrough, Link2, Unlink, List, ListOrdered, Code } from 'lucide-react';

interface TiptapBubbleMenuProps {
  editor: Editor;
  showLists?: boolean;
}

const btn = (active: boolean) =>
  `w-7 h-7 flex items-center justify-center transition-colors ${
    active
      ? 'bg-foreground text-background'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
  }`;

export const TiptapBubbleMenu = ({ editor, showLists = false }: TiptapBubbleMenuProps) => {
  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt('Enter URL:', 'https://');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100, placement: 'top' }}>
      <div className="flex items-center bg-background border border-border shadow-lg">
        <button
          className={btn(editor.isActive('bold'))}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3 h-3" />
        </button>
        <button
          className={btn(editor.isActive('italic'))}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3 h-3" />
        </button>
        <button
          className={btn(editor.isActive('underline'))}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3 h-3" />
        </button>
        <button
          className={btn(editor.isActive('strike'))}
          onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
          title="Strikethrough"
        >
          <Strikethrough className="w-3 h-3" />
        </button>
        <span className="w-px h-4 bg-border mx-0.5" />
        <button
          className={btn(editor.isActive('link'))}
          onMouseDown={handleLink}
          title={editor.isActive('link') ? 'Remove link' : 'Add link'}
        >
          {editor.isActive('link') ? <Unlink className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
        </button>
        {showLists && (
          <>
            <span className="w-px h-4 bg-border mx-0.5" />
            <button
              className={btn(editor.isActive('bulletList'))}
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
              title="Bullet List"
            >
              <List className="w-3 h-3" />
            </button>
            <button
              className={btn(editor.isActive('orderedList'))}
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
              title="Ordered List"
            >
              <ListOrdered className="w-3 h-3" />
            </button>
            <span className="w-px h-4 bg-border mx-0.5" />
            <button
              className={btn(editor.isActive('code'))}
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
              title="Inline Code"
            >
              <Code className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </BubbleMenu>
  );
};
