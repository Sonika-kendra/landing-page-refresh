import { Editor, Frame, Element } from '@craftjs/core';
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
} from '../admin/builder/blocks';

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

interface CraftRendererProps {
  content: string;
}

const CraftRenderer = ({ content }: CraftRendererProps) => (
  <Editor enabled={false} resolver={RESOLVER}>
    <Frame data={content}>
      <Element is={RootCanvas} canvas />
    </Frame>
  </Editor>
);

export default CraftRenderer;
