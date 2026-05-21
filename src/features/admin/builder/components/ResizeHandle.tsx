import { GripVertical, GripHorizontal } from 'lucide-react';

interface ResizeHandleProps {
  direction: 'right' | 'bottom';
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const ResizeHandle = ({ direction, onPointerDown }: ResizeHandleProps) =>
  direction === 'right' ? (
    <div
      className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize z-20 flex items-center justify-center select-none group"
      onPointerDown={onPointerDown}
      title="Drag to resize width"
    >
      {/* Track line */}
      <span className="absolute right-0 top-0 bottom-0 w-[2px] bg-primary/40 group-hover:bg-primary/80 transition-colors" />
      {/* Grip icon centered on the line */}
      <span className="relative z-10 flex items-center justify-center w-4 h-6 bg-background border border-border shadow-sm opacity-70 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-2.5 h-2.5 text-muted-foreground" />
      </span>
    </div>
  ) : (
    <div
      className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize z-20 flex items-center justify-center select-none group"
      onPointerDown={onPointerDown}
      title="Drag to resize height"
    >
      {/* Track line */}
      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/40 group-hover:bg-primary/80 transition-colors" />
      {/* Grip icon centered on the line */}
      <span className="relative z-10 flex items-center justify-center h-4 w-6 bg-background border border-border shadow-sm opacity-70 group-hover:opacity-100 transition-opacity">
        <GripHorizontal className="w-2.5 h-2.5 text-muted-foreground" />
      </span>
    </div>
  );
