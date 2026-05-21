import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Undo2, Redo2, Maximize2, Minimize2, LayoutTemplate } from 'lucide-react';
import {
  HeadingBlock,
  TextBlock,
  ImageBlock,
  DividerBlock,
  ButtonBlock,
  SpacerBlock,
  QuoteBlock,
  VideoBlock,
  HTMLBlock,
  RootCanvas,
  ColumnsBlock,
  ThreeColumnsBlock,
  ColumnContainer,
} from './blocks';
import BlockSidebar from './components/BlockSidebar';
import SettingsPanel from './components/SettingsPanel';

const RESOLVER = {
  RootCanvas,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  DividerBlock,
  ButtonBlock,
  SpacerBlock,
  QuoteBlock,
  VideoBlock,
  HTMLBlock,
  ColumnsBlock,
  ThreeColumnsBlock,
  ColumnContainer,
};

export const isCraftJSON = (content: string): boolean => {
  if (!content || content.trim().startsWith('<')) return false;
  try {
    const parsed = JSON.parse(content);
    return typeof parsed === 'object' && parsed !== null && 'ROOT' in parsed;
  } catch {
    return false;
  }
};

// ── Template helpers ──────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

type NodeDef = { type: string; props: Record<string, unknown> };

const makeTemplateJSON = (blocks: NodeDef[]): string => {
  const ids = blocks.map(() => uid());
  const nodes: Record<string, unknown> = {
    ROOT: {
      type: { resolvedName: 'RootCanvas' },
      isCanvas: true,
      props: {},
      displayName: 'Canvas',
      custom: {},
      hidden: false,
      nodes: ids,
      linkedNodes: {},
    },
  };
  blocks.forEach((b, i) => {
    nodes[ids[i]] = {
      type: { resolvedName: b.type },
      isCanvas: false,
      props: b.props,
      displayName: b.type.replace('Block', ''),
      custom: {},
      parent: 'ROOT',
      hidden: false,
      nodes: [],
      linkedNodes: {},
    };
  });
  return JSON.stringify(nodes);
};

const TEMPLATES: { label: string; json: () => string }[] = [
  {
    label: 'Standard Article',
    json: () =>
      makeTemplateJSON([
        { type: 'HeadingBlock', props: { text: 'Article Title', level: 'h1', textAlign: 'left', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Write your introduction paragraph here. Set the scene and draw the reader in.', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'ImageBlock', props: { src: '', alt: '', caption: '', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Continue with the main body of your article. Add as many paragraphs as you need.', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'DividerBlock', props: { spacing: 'md', style: 'solid', width: '100%' } },
        { type: 'ButtonBlock', props: { label: 'Read More', url: '#', align: 'left', variant: 'filled', width: '100%' } },
      ]),
  },
  {
    label: 'Tips & Tricks',
    json: () =>
      makeTemplateJSON([
        { type: 'HeadingBlock', props: { text: '5 Tips for…', level: 'h1', textAlign: 'left', width: '100%' } },
        { type: 'TextBlock', props: { text: 'A brief introduction to what readers will learn.', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'HeadingBlock', props: { text: '1. First Tip', level: 'h2', textAlign: 'left', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Explain this tip in detail.', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'HeadingBlock', props: { text: '2. Second Tip', level: 'h2', textAlign: 'left', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Explain this tip in detail.', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'HeadingBlock', props: { text: '3. Third Tip', level: 'h2', textAlign: 'left', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Explain this tip in detail.', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'DividerBlock', props: { spacing: 'lg', style: 'solid', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Conclusion — summarise the key takeaways for your readers.', fontSize: 'base', textAlign: 'left', width: '100%' } },
      ]),
  },
  {
    label: 'Diamond Story',
    json: () =>
      makeTemplateJSON([
        { type: 'ImageBlock', props: { src: '', alt: '', caption: '', width: '100%' } },
        { type: 'HeadingBlock', props: { text: 'Diamond Story Headline', level: 'h1', textAlign: 'center', width: '100%' } },
        { type: 'QuoteBlock', props: { text: 'A compelling quote about this piece.', attribution: '— Expert Name', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Tell the story of this diamond or piece. What makes it exceptional?', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Additional context — provenance, craftsmanship, or what sets it apart.', fontSize: 'base', textAlign: 'left', width: '100%' } },
        { type: 'SpacerBlock', props: { height: 24, width: '100%' } },
        { type: 'ButtonBlock', props: { label: 'Shop This Piece', url: '#', align: 'center', variant: 'filled', width: '100%' } },
      ]),
  },
  {
    label: 'Video Feature',
    json: () =>
      makeTemplateJSON([
        { type: 'HeadingBlock', props: { text: 'Watch: Feature Title', level: 'h1', textAlign: 'left', width: '100%' } },
        { type: 'VideoBlock', props: { url: '', aspectRatio: '16:9', width: '100%' } },
        { type: 'TextBlock', props: { text: 'Describe what viewers will discover in this video.', fontSize: 'base', textAlign: 'left', width: '100%' } },
      ]),
  },
];

// ── Internal components ───────────────────────────────────────────────────────

function ContentHandle({ handleRef }: { handleRef: React.MutableRefObject<BlogBuilderHandle | null> }) {
  const { query } = useEditor();
  useEffect(() => {
    handleRef.current = {
      getContent: () => {
        try { return query.serialize(); }
        catch { return ''; }
      },
    };
  }, [query, handleRef]);
  return null;
}

function EditorToolbar({
  isFullscreen,
  onToggleFullscreen,
}: {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const { actions, canUndo, canRedo, query } = useEditor((state, q) => ({
    canUndo: q.history.canUndo(),
    canRedo: q.history.canRedo(),
  }));
  const [templatesOpen, setTemplatesOpen] = useState(false);

  const iconBtn = (active: boolean) =>
    `p-1 transition-colors ${
      active
        ? 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        : 'text-muted-foreground/25 cursor-not-allowed'
    }`;

  const applyTemplate = (jsonFn: () => string) => {
    try {
      actions.deserialize(jsonFn());
    } catch {
      // fallback: CraftJS may not support deserialize in this build
    }
    setTemplatesOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/10 relative">
      <div className="flex items-center gap-1">
        {/* Templates dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 px-2 py-1 text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors border border-transparent hover:border-border"
            onClick={() => setTemplatesOpen(v => !v)}
            title="Start from a template"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>
          {templatesOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setTemplatesOpen(false)} />
              <div className="absolute left-0 top-full mt-1 z-50 bg-background border border-border shadow-lg min-w-[160px]">
                {TEMPLATES.map(t => (
                  <button
                    key={t.label}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted/40 transition-colors"
                    onClick={() => applyTemplate(t.json)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <span className="w-px h-3 bg-border mx-1" />

        <button
          className={iconBtn(canUndo)}
          disabled={!canUndo}
          onClick={() => actions.history.undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          className={iconBtn(canRedo)}
          disabled={!canRedo}
          onClick={() => actions.history.redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-[10px] text-muted-foreground/40 tracking-wide hidden sm:block">
          Drag blocks · Click to select · Select text to format
        </p>
        <button
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen editor'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface BlogBuilderHandle {
  getContent: () => string;
}

export interface BlogBuilderProps {
  value?: string;
  onUploadImage?: (file: File) => Promise<string>;
}

const BlogBuilder = forwardRef<BlogBuilderHandle, BlogBuilderProps>(
  ({ value = '', onUploadImage }, ref) => {
    const handleRef = useRef<BlogBuilderHandle | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useImperativeHandle(ref, () => ({
      getContent: () => handleRef.current?.getContent() ?? '',
    }));

    const craftData = isCraftJSON(value) ? value : undefined;

    const editorContent = (
      <Editor resolver={RESOLVER}>
        <ContentHandle handleRef={handleRef} />
        <div
          className="flex flex-col border border-border bg-background"
          style={isFullscreen ? { height: '100%' } : { height: 580 }}
        >
          <EditorToolbar
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(v => !v)}
          />
          <div className="flex flex-1 min-h-0">
            <BlockSidebar />

            {/* Canvas */}
            <div className="flex-1 overflow-y-auto bg-muted/5 p-6">
              <div className="max-w-2xl mx-auto bg-white shadow-sm p-8 min-h-full">
                <Frame data={craftData}>
                  <Element is={RootCanvas} canvas>
                    <HeadingBlock text="Your Blog Post Heading" level="h2" />
                    <TextBlock text="Start writing your content here. Drag new blocks from the left panel to add more sections." />
                  </Element>
                </Frame>
              </div>
            </div>

            <SettingsPanel />
          </div>
        </div>
      </Editor>
    );

    if (isFullscreen) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {editorContent}
        </div>
      );
    }

    return editorContent;
  }
);

BlogBuilder.displayName = 'BlogBuilder';
export default BlogBuilder;
