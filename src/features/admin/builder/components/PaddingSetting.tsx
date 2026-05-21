import { useNode } from '@craftjs/core';

const PADDING_OPTIONS = [0, 8, 16, 24, 32, 48] as const;

export const PaddingSetting = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as { paddingTop?: number; paddingBottom?: number },
  }));

  return (
    <div className="space-y-2">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Padding Top
        </label>
        <div className="flex gap-1 flex-wrap">
          {PADDING_OPTIONS.map(v => (
            <button
              key={v}
              onClick={() => setProp((p: any) => { p.paddingTop = v; })}
              className={`flex-1 py-1 text-xs border transition-colors min-w-[28px] ${
                (props.paddingTop ?? 0) === v
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Padding Bottom
        </label>
        <div className="flex gap-1 flex-wrap">
          {PADDING_OPTIONS.map(v => (
            <button
              key={v}
              onClick={() => setProp((p: any) => { p.paddingBottom = v; })}
              className={`flex-1 py-1 text-xs border transition-colors min-w-[28px] ${
                (props.paddingBottom ?? 0) === v
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
