import { useNode } from '@craftjs/core';

const WIDTHS = ['100%', '75%', '50%', '33%'] as const;

export const WidthSetting = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as { width?: string },
  }));

  const current = props.width ?? '100%';

  return (
    <div>
      <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
        Width
      </label>
      <div className="flex gap-1">
        {WIDTHS.map(w => (
          <button
            key={w}
            onClick={() => setProp((p: any) => { p.width = w; })}
            className={`flex-1 py-1 text-xs border transition-colors ${
              current === w
                ? 'bg-foreground text-background border-foreground'
                : 'border-border hover:bg-muted/40'
            }`}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
};
