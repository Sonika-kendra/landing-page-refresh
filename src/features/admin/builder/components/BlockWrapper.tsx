import { useNode } from '@craftjs/core';
import { GripVertical } from 'lucide-react';
import { BlockToolbar } from './BlockToolbar';
import { useBlockResize } from '../hooks/useBlockResize';
import { ResizeHandle } from './ResizeHandle';

interface BlockWrapperProps {
  children: React.ReactNode;
  width?: string;
  className?: string;
  style?: React.CSSProperties;
  resizeRight?: boolean;
  resizeBottom?: boolean;
}

export const BlockWrapper = ({
  children,
  width = '100%',
  className = '',
  style,
  resizeRight,
  resizeBottom,
}: BlockWrapperProps) => {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode(state => ({ isSelected: state.events.selected }));
  const { enabled, handleRightResize, handleBottomResize } = useBlockResize();

  return (
    <div
      ref={(ref: any) => ref && connect(ref)}
      style={{ width, position: 'relative', ...(width !== '100%' ? { marginLeft: 'auto', marginRight: 'auto' } : {}), ...style }}
      className={`group/bw ${className} ${
        enabled ? 'hover:ring-1 hover:ring-border' : ''
      } ${enabled && isSelected ? 'ring-1 ring-primary/60' : ''}`}
    >
      {/* Drag handle — full-height left strip, visible on hover */}
      {enabled && (
        <div
          ref={(ref: any) => ref && drag(ref)}
          className="absolute left-0 top-0 bottom-0 w-5 cursor-grab active:cursor-grabbing z-20 flex items-center justify-center opacity-0 group-hover/bw:opacity-100 hover:bg-muted/20 transition-opacity select-none"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground/60" />
        </div>
      )}

      {/* Per-block action toolbar — top-right on selection */}
      {enabled && isSelected && <BlockToolbar />}

      {children}

      {enabled && isSelected && resizeRight && (
        <ResizeHandle direction="right" onPointerDown={handleRightResize} />
      )}
      {enabled && isSelected && resizeBottom && (
        <ResizeHandle direction="bottom" onPointerDown={handleBottomResize} />
      )}
    </div>
  );
};
