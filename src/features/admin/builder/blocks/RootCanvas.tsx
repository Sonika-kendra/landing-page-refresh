import { useNode, useEditor } from '@craftjs/core';

export const RootCanvas = ({ children }: { children?: React.ReactNode }) => {
  const { connectors: { connect } } = useNode();
  const { enabled } = useEditor(state => ({ enabled: state.options.enabled }));

  return (
    <div
      ref={(ref: any) => ref && connect(ref)}
      className={`min-h-[320px] w-full ${
        enabled
          ? 'outline-none'
          : ''
      }`}
    >
      {children}
      {enabled && !children && (
        <div className="flex items-center justify-center h-40 border-2 border-dashed border-border/40">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            Drag blocks here to start
          </p>
        </div>
      )}
    </div>
  );
};

RootCanvas.craft = {
  displayName: 'Canvas',
  rules: {
    canMoveIn: () => true,
    canMoveOut: () => false,
    canDrag: () => false,
  },
};
