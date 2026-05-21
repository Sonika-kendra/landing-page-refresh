import { useEffect, useState, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Underline, Strikethrough, Link2, Unlink } from 'lucide-react';

interface FormatToolbarProps {
  containerRef: RefObject<HTMLElement | null>;
}

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export const FormatToolbar = ({ containerRef }: FormatToolbarProps) => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [formats, setFormats] = useState<ActiveFormats>({ bold: false, italic: false, underline: false, strikethrough: false });
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        setCoords(null);
        return;
      }
      if (!containerRef.current?.contains(sel.anchorNode)) {
        setCoords(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width) {
        setCoords(null);
        return;
      }
      setCoords({ x: rect.left + rect.width / 2, y: rect.top });
      setFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough'),
      });
      // Check if selection is inside a link
      const anchor = sel.anchorNode?.parentElement?.closest('a');
      setIsLink(!!anchor);
    };
    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  }, [containerRef]);

  if (!coords) return null;

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    setFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
    });
  };

  const handleLink = () => {
    if (isLink) {
      exec('unlink');
      setIsLink(false);
    } else {
      const url = window.prompt('Enter URL:', 'https://');
      if (url) {
        exec('createLink', url);
        // Make link open in new tab — find newly created anchor
        const sel = window.getSelection();
        if (sel?.anchorNode?.parentElement) {
          const a = sel.anchorNode.parentElement.closest('a');
          if (a) a.setAttribute('target', '_blank');
        }
        setIsLink(true);
      }
    }
  };

  const btn = (active: boolean) =>
    `w-7 h-7 flex items-center justify-center transition-colors ${
      active
        ? 'bg-foreground text-background'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: coords.x,
        top: coords.y - 6,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999,
      }}
      className="flex items-center bg-background border border-border shadow-lg"
      onMouseDown={e => e.preventDefault()}
    >
      <button className={btn(formats.bold)} onMouseDown={() => exec('bold')} title="Bold (Ctrl+B)">
        <Bold className="w-3 h-3" />
      </button>
      <button className={btn(formats.italic)} onMouseDown={() => exec('italic')} title="Italic (Ctrl+I)">
        <Italic className="w-3 h-3" />
      </button>
      <button className={btn(formats.underline)} onMouseDown={() => exec('underline')} title="Underline (Ctrl+U)">
        <Underline className="w-3 h-3" />
      </button>
      <button className={btn(formats.strikethrough)} onMouseDown={() => exec('strikeThrough')} title="Strikethrough">
        <Strikethrough className="w-3 h-3" />
      </button>
      <span className="w-px h-4 bg-border mx-0.5" />
      <button className={btn(isLink)} onMouseDown={handleLink} title={isLink ? 'Remove link' : 'Add link'}>
        {isLink ? <Unlink className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
      </button>
    </div>,
    document.body
  );
};
