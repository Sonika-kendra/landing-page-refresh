import { useRef, useEffect } from 'react';
import { useNode, useEditor as useCraftEditor } from '@craftjs/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { PaddingSetting } from '../components/PaddingSetting';
import { TiptapBubbleMenu } from '../components/TiptapBubbleMenu';
import { TiptapToolbar } from '../components/TiptapToolbar';

export interface TextBlockProps {
  text?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: 'sm' | 'base' | 'lg';
  width?: string;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export const TextSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as TextBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Size
        </label>
        <div className="flex gap-1">
          {(['sm', 'base', 'lg'] as const).map(s => (
            <button
              key={s}
              onClick={() => setProp((p: any) => { p.fontSize = s; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.fontSize ?? 'base') === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {s === 'sm' ? 'Small' : s === 'base' ? 'Normal' : 'Large'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Alignment
        </label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map(a => (
            <button
              key={a}
              onClick={() => setProp((p: any) => { p.textAlign = a; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.textAlign ?? 'left') === a
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {a[0].toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <WidthSetting />
      <PaddingSetting />
    </div>
  );
};

// ── Inner Tiptap editor (only mounted in edit mode) ───────────────────────────

interface TextEditorProps {
  text: string;
  textAlign: string;
  fontSize: string;
  onChange: (html: string) => void;
}

const TextEditor = ({ text, textAlign, fontSize, onChange }: TextEditorProps) => {
  // useNode works here because TextEditor is rendered inside a CraftJS node tree
  const { isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const isFocused = useRef(false);
  const sizeClass = ({ sm: 'text-sm', base: 'text-base', lg: 'text-lg' } as Record<string, string>)[fontSize] ?? 'text-base';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder: 'Write your paragraph text here…' }),
    ],
    content: text || '',
    onFocus: () => { isFocused.current = true; },
    onBlur: () => { isFocused.current = false; },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content when props change externally (undo/redo, template load)
  useEffect(() => {
    if (editor && !isFocused.current) {
      const current = editor.getHTML();
      if (current !== text) {
        editor.commands.setContent(text || '', false);
      }
    }
  }, [text, editor]);

  return (
    <>
      {isSelected && editor && <TiptapToolbar editor={editor} showLists />}
      {editor && <TiptapBubbleMenu editor={editor} showLists />}
      <EditorContent
        editor={editor}
        className={`tiptap-editor ${sizeClass} text-foreground/80 leading-relaxed`}
        style={{ textAlign: textAlign as React.CSSProperties['textAlign'] }}
      />
    </>
  );
};

// ── Public CraftJS component ──────────────────────────────────────────────────

export const TextBlock = ({
  text = '',
  textAlign = 'left',
  fontSize = 'base',
  width = '100%',
  height,
  paddingTop = 0,
  paddingBottom = 0,
}: TextBlockProps) => {
  const { actions: { setProp } } = useNode();
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));
  const sizeClass = ({ sm: 'text-sm', base: 'text-base', lg: 'text-lg' } as Record<string, string>)[fontSize] ?? 'text-base';

  return (
    <BlockWrapper
      width={width}
      className="mb-4"
      style={{ ...(height ? { minHeight: height } : {}), paddingTop, paddingBottom }}
      resizeRight={enabled}
      resizeBottom={enabled}
    >
      {enabled ? (
        <TextEditor
          text={text}
          textAlign={textAlign}
          fontSize={fontSize}
          onChange={html => setProp((p: any) => { p.text = html; })}
        />
      ) : (
        <div
          className={`tiptap-content text-foreground/80 leading-relaxed ${sizeClass}`}
          style={{ textAlign: textAlign as React.CSSProperties['textAlign'] }}
          dangerouslySetInnerHTML={{ __html: text || '' }}
        />
      )}
    </BlockWrapper>
  );
};

TextBlock.craft = {
  displayName: 'Text',
  props: {
    text: '',
    textAlign: 'left',
    fontSize: 'base',
    width: '100%',
    height: undefined,
    paddingTop: 0,
    paddingBottom: 0,
  },
  related: { settings: TextSettings },
};
