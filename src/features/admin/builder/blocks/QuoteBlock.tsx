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

export interface QuoteBlockProps {
  text?: string;
  attribution?: string;
  width?: string;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export const QuoteSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as QuoteBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Attribution
        </label>
        <input
          type="text"
          value={props.attribution ?? ''}
          onChange={e => setProp((p: any) => { p.attribution = e.target.value; })}
          placeholder="— Author Name"
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground"
        />
      </div>
      <WidthSetting />
      <PaddingSetting />
    </div>
  );
};

// ── Inner Tiptap editor for quote body ───────────────────────────────────────

interface QuoteEditorProps {
  text: string;
  onChange: (html: string) => void;
}

const QuoteEditor = ({ text, onChange }: QuoteEditorProps) => {
  const { isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const isFocused = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder: 'Enter your quote text here…' }),
    ],
    content: text || '',
    onFocus: () => { isFocused.current = true; },
    onBlur: () => { isFocused.current = false; },
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
  });

  useEffect(() => {
    if (editor && !isFocused.current) {
      const current = editor.getHTML();
      if (current !== text) editor.commands.setContent(text || '', false);
    }
  }, [text, editor]);

  return (
    <>
      {isSelected && editor && <TiptapToolbar editor={editor} />}
      {editor && <TiptapBubbleMenu editor={editor} />}
      <EditorContent
        editor={editor}
        className="tiptap-editor font-serif text-lg italic text-foreground/80 leading-relaxed outline-none"
      />
    </>
  );
};

// ── Public CraftJS component ──────────────────────────────────────────────────

export const QuoteBlock = ({
  text = 'Enter your quote text here.',
  attribution = '',
  width = '100%',
  height,
  paddingTop = 0,
  paddingBottom = 0,
}: QuoteBlockProps) => {
  const { actions: { setProp } } = useNode();
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));

  return (
    <BlockWrapper
      width={width}
      className="my-6"
      style={{ ...(height ? { minHeight: height } : {}), paddingTop, paddingBottom }}
      resizeRight={enabled}
      resizeBottom={enabled}
    >
      <blockquote className="border-l-2 border-foreground pl-6">
        {enabled ? (
          <QuoteEditor text={text} onChange={html => setProp((p: any) => { p.text = html; })} />
        ) : (
          <div
            className="tiptap-content font-serif text-lg italic text-foreground/80 leading-relaxed mb-2"
            dangerouslySetInnerHTML={{ __html: text || '' }}
          />
        )}
        {(attribution || enabled) && (
          <cite
            contentEditable={enabled}
            suppressContentEditableWarning
            onBlur={(e: any) => enabled && setProp((p: any) => { p.attribution = e.currentTarget.innerText; })}
            dangerouslySetInnerHTML={{ __html: attribution || (enabled ? '— Attribution' : '') }}
            className="text-sm text-muted-foreground not-italic outline-none block mt-2"
          />
        )}
      </blockquote>
    </BlockWrapper>
  );
};

QuoteBlock.craft = {
  displayName: 'Quote',
  props: { text: 'Enter your quote text here.', attribution: '', width: '100%', height: undefined, paddingTop: 0, paddingBottom: 0 },
  related: { settings: QuoteSettings },
};
