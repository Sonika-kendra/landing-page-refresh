import { useEffect } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { cn } from '@/lib/utils';

interface BlockNoteEditorProps {
  initialValue?: string;
  onChange: (html: string) => void;
  className?: string;
}

export const BlockNoteEditor = ({ initialValue = '', onChange, className }: BlockNoteEditorProps) => {
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (!initialValue) return;
    editor.tryParseHTMLToBlocks(initialValue).then(blocks => {
      editor.replaceBlocks(editor.document, blocks);
    });
  }, []); // Component is always remounted via key prop when value changes

  const handleChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    onChange(html);
  };

  return (
    <BlockNoteView
      editor={editor}
      onChange={handleChange}
      className={cn('rounded-sm overflow-hidden text-xs', className)}
    />
  );
};
