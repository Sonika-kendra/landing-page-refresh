import { useEditor } from '@craftjs/core';
import { Type, AlignLeft, Image, Minus, MousePointerClick, Rows3, MessageSquareQuote, Columns2, Columns3, Video, Code2 } from 'lucide-react';
import { HeadingBlock } from '../blocks/HeadingBlock';
import { TextBlock } from '../blocks/TextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { DividerBlock } from '../blocks/DividerBlock';
import { ButtonBlock } from '../blocks/ButtonBlock';
import { SpacerBlock } from '../blocks/SpacerBlock';
import { QuoteBlock } from '../blocks/QuoteBlock';
import { VideoBlock } from '../blocks/VideoBlock';
import { HTMLBlock } from '../blocks/HTMLBlock';
import { ColumnsBlock, ThreeColumnsBlock } from '../blocks/ColumnsBlock';

interface BlockItemConfig {
  label: string;
  icon: React.ReactNode;
  element: React.ReactElement;
}

const BLOCK_GROUPS: { label: string; blocks: BlockItemConfig[] }[] = [
  {
    label: 'Layout',
    blocks: [
      {
        label: '2 Col',
        icon: <Columns2 className="w-4 h-4" />,
        element: <ColumnsBlock gap="md" ratio="1:1" />,
      },
      {
        label: '3 Col',
        icon: <Columns3 className="w-4 h-4" />,
        element: <ThreeColumnsBlock gap="md" />,
      },
    ],
  },
  {
    label: 'Content',
    blocks: [
      {
        label: 'Heading',
        icon: <Type className="w-4 h-4" />,
        element: <HeadingBlock text="Your Heading" level="h2" />,
      },
      {
        label: 'Text',
        icon: <AlignLeft className="w-4 h-4" />,
        element: <TextBlock text="Write your paragraph here." />,
      },
      {
        label: 'Quote',
        icon: <MessageSquareQuote className="w-4 h-4" />,
        element: <QuoteBlock text="Your quote text." />,
      },
    ],
  },
  {
    label: 'Media',
    blocks: [
      {
        label: 'Image',
        icon: <Image className="w-4 h-4" />,
        element: <ImageBlock />,
      },
      {
        label: 'Video',
        icon: <Video className="w-4 h-4" />,
        element: <VideoBlock />,
      },
      {
        label: 'HTML',
        icon: <Code2 className="w-4 h-4" />,
        element: <HTMLBlock />,
      },
    ],
  },
  {
    label: 'Widgets',
    blocks: [
      {
        label: 'Button',
        icon: <MousePointerClick className="w-4 h-4" />,
        element: <ButtonBlock label="Click Here" />,
      },
      {
        label: 'Divider',
        icon: <Minus className="w-4 h-4" />,
        element: <DividerBlock />,
      },
      {
        label: 'Spacer',
        icon: <Rows3 className="w-4 h-4" />,
        element: <SpacerBlock height={40} />,
      },
    ],
  },
];

const BlockItem = ({ label, icon, element }: BlockItemConfig) => {
  const { connectors: { create }, actions, query } = useEditor();

  const handleClick = () => {
    try {
      const tree = query.parseReactElement(element).toNodeTree();
      actions.addNodeTree(tree, 'ROOT');
    } catch {
      // layout blocks (columns) may not fully parse — silently skip
    }
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => { if (ref) create(ref, element); }}
      onClick={handleClick}
      className="flex flex-col items-center gap-1.5 p-2 border border-border cursor-grab hover:bg-muted/30 hover:border-foreground/20 active:cursor-grabbing transition-colors select-none"
      title={`Click or drag to add ${label}`}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{label}</span>
    </div>
  );
};

const BlockSidebar = () => (
  <div className="w-44 shrink-0 border-r border-border bg-background overflow-y-auto">
    <div className="p-3 border-b border-border">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
        Blocks
      </p>
    </div>
    {BLOCK_GROUPS.map(group => (
      <div key={group.label} className="p-3">
        <p className="text-[9px] tracking-widest uppercase text-muted-foreground/60 mb-2">
          {group.label}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {group.blocks.map(block => (
            <BlockItem key={block.label} {...block} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default BlockSidebar;
