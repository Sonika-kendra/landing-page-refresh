import { useRef, useEffect } from 'react';
import { useNode, useEditor as useCraftEditor } from '@craftjs/core';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { PaddingSetting } from '../components/PaddingSetting';
import { TiptapBubbleMenu } from '../components/TiptapBubbleMenu';
import { TiptapToolbar } from '../components/TiptapToolbar';

export interface HeadingBlockProps {
  text?: string;
  level?: 'h1' | 'h2' | 'h3';
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export const HeadingSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as HeadingBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Level
        </label>
        <select
          value={props.level ?? 'h2'}
          onChange={e => setProp((p: any) => { p.level = e.target.value; })}
          className="w-full border border-border px-2 py-1.5 text-sm bg-background focus:outline-none focus:border-foreground"
        >
          <option value="h1">H1 – Large Title</option>
          <option value="h2">H2 – Section Heading</option>
          <option value="h3">H3 – Sub Heading</option>
        </select>
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

// Single-line extension — prevents Enter from splitting the heading
const PreventEnter = Extension.create({
  name: 'preventEnter',
  addKeyboardShortcuts() {
    return { Enter: () => true };
  },
});

// ── Inner Tiptap editor (only mounted in edit mode) ───────────────────────────

interface HeadingEditorProps {
  text: string;
  level: 'h1' | 'h2' | 'h3';
  textAlign: string;
  onChange: (html: string) => void;
}

const toNumericLevel = (level: string) => parseInt(level.slice(1)) as 1 | 2 | 3;

const HeadingEditor = ({ text, level, textAlign, onChange }: HeadingEditorProps) => {
  const { isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const isFocused = useRef(false);
  const sizeClass = { h1: 'text-4xl', h2: 'text-2xl', h3: 'text-xl' }[level];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        hardBreak: false,
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder: 'Your Heading' }),
      PreventEnter,
    ],
    content: `<h${toNumericLevel(level)}>${text || ''}</h${toNumericLevel(level)}>`,
    onFocus: () => { isFocused.current = true; },
    onBlur: () => { isFocused.current = false; },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const match = html.match(/^<h[1-6]>(.*)<\/h[1-6]>$/s);
      onChange(match ? match[1] : html);
    },
  });

  // Sync content and level when props change externally (undo/redo, level switch)
  useEffect(() => {
    if (editor && !isFocused.current) {
      const numLevel = toNumericLevel(level);
      const expected = `<h${numLevel}>${text || ''}</h${numLevel}>`;
      if (editor.getHTML() !== expected) {
        editor.commands.setContent(expected, false);
      }
    }
  }, [text, level, editor]);

  return (
    <>
      {isSelected && editor && <TiptapToolbar editor={editor} />}
      {editor && <TiptapBubbleMenu editor={editor} />}
      <EditorContent
        editor={editor}
        className={`tiptap-heading-editor font-serif font-normal text-foreground outline-none ${sizeClass}`}
        style={{ textAlign: textAlign as React.CSSProperties['textAlign'] }}
      />
    </>
  );
};

// ── Public CraftJS component ──────────────────────────────────────────────────

export const HeadingBlock = ({
  text = 'Your Heading',
  level = 'h2',
  textAlign = 'left',
  width = '100%',
  height,
  paddingTop = 0,
  paddingBottom = 0,
}: HeadingBlockProps) => {
  const { actions: { setProp } } = useNode();
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));

  const Tag = level as keyof JSX.IntrinsicElements;
  const sizeClass = { h1: 'text-4xl', h2: 'text-2xl', h3: 'text-xl' }[level];

  return (
    <BlockWrapper
      width={width}
      className="mb-3"
      style={{ ...(height ? { minHeight: height } : {}), paddingTop, paddingBottom }}
      resizeRight={enabled}
      resizeBottom={enabled}
    >
      {enabled ? (
        <HeadingEditor
          text={text}
          level={level}
          textAlign={textAlign}
          onChange={html => setProp((p: any) => { p.text = html; })}
        />
      ) : (
        <Tag
          className={`font-serif text-foreground font-normal ${sizeClass}`}
          style={{ textAlign: textAlign as React.CSSProperties['textAlign'] }}
          dangerouslySetInnerHTML={{ __html: text || '' }}
        />
      )}
    </BlockWrapper>
  );
};

HeadingBlock.craft = {
  displayName: 'Heading',
  props: {
    text: 'Your Heading',
    level: 'h2',
    textAlign: 'left',
    width: '100%',
    height: undefined,
    paddingTop: 0,
    paddingBottom: 0,
  },
  related: { settings: HeadingSettings },
};
