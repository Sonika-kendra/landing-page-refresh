import { Element, useNode, useEditor } from '@craftjs/core';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';

// ─── ColumnContainer ──────────────────────────────────────────────────────────

export const ColumnContainer = ({ children }: { children?: React.ReactNode }) => {
  const { connectors: { connect } } = useNode();
  const { enabled } = useEditor(state => ({ enabled: state.options.enabled }));

  return (
    <div
      ref={(ref: any) => ref && connect(ref)}
      className={`w-full min-w-0 ${
        enabled
          ? 'border border-dashed border-muted-foreground/25 p-2 min-h-[80px] hover:border-muted-foreground/50 transition-colors'
          : ''
      }`}
    >
      {children}
      {enabled && !children && (
        <div className="flex items-center justify-center h-12">
          <p className="text-[9px] text-muted-foreground/40 tracking-widest uppercase select-none">
            Drop blocks here
          </p>
        </div>
      )}
    </div>
  );
};

ColumnContainer.craft = {
  displayName: 'Column',
  rules: {
    canMoveIn: () => true,
    canDrag: () => false,
  },
};

// ─── ColumnsBlock (2 col) ─────────────────────────────────────────────────────

export interface ColumnsBlockProps {
  gap?: 'none' | 'sm' | 'md' | 'lg';
  ratio?: '1:1' | '2:1' | '1:2';
  width?: string;
  verticalAlign?: 'top' | 'center' | 'bottom';
}

export const ColumnsSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as ColumnsBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Gap
        </label>
        <div className="flex gap-1">
          {(['none', 'sm', 'md', 'lg'] as const).map(g => (
            <button
              key={g}
              onClick={() => setProp((p: any) => { p.gap = g; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.gap ?? 'md') === g
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {g === 'none' ? 'None' : g === 'sm' ? 'S' : g === 'md' ? 'M' : 'L'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Ratio
        </label>
        <div className="flex gap-1">
          {(['1:1', '2:1', '1:2'] as const).map(r => (
            <button
              key={r}
              onClick={() => setProp((p: any) => { p.ratio = r; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.ratio ?? '1:1') === r
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Vertical Align
        </label>
        <div className="flex gap-1">
          {([
            { value: 'top', label: 'Top' },
            { value: 'center', label: 'Center' },
            { value: 'bottom', label: 'Bottom' },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setProp((p: any) => { p.verticalAlign = value; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.verticalAlign ?? 'top') === value
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <WidthSetting />
    </div>
  );
};

export const ColumnsBlock = ({ gap = 'md', ratio = '1:1', width = '100%', verticalAlign = 'top' }: ColumnsBlockProps) => {
  const gapClass = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-8' }[gap];
  const justifyClass = { top: 'justify-start', center: 'justify-center', bottom: 'justify-end' }[verticalAlign];
  const col1Flex = ratio === '1:2' ? '1' : ratio === '2:1' ? '2' : '1';
  const col2Flex = ratio === '2:1' ? '1' : ratio === '1:2' ? '2' : '1';

  return (
    <BlockWrapper width={width} className={`flex mb-4 ${gapClass}`} resizeRight>
      <div style={{ flex: col1Flex }} className={`flex flex-col ${justifyClass}`}>
        <Element id="col-1" is={ColumnContainer} canvas />
      </div>
      <div style={{ flex: col2Flex }} className={`flex flex-col ${justifyClass}`}>
        <Element id="col-2" is={ColumnContainer} canvas />
      </div>
    </BlockWrapper>
  );
};

ColumnsBlock.craft = {
  displayName: '2 Columns',
  props: { gap: 'md', ratio: '1:1', width: '100%', verticalAlign: 'top' },
  related: { settings: ColumnsSettings },
};

// ─── ThreeColumnsBlock ────────────────────────────────────────────────────────

export interface ThreeColumnsBlockProps {
  gap?: 'none' | 'sm' | 'md' | 'lg';
  width?: string;
  verticalAlign?: 'top' | 'center' | 'bottom';
}

export const ThreeColumnsSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as ThreeColumnsBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Gap
        </label>
        <div className="flex gap-1">
          {(['none', 'sm', 'md', 'lg'] as const).map(g => (
            <button
              key={g}
              onClick={() => setProp((p: any) => { p.gap = g; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.gap ?? 'md') === g
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {g === 'none' ? 'None' : g === 'sm' ? 'S' : g === 'md' ? 'M' : 'L'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Vertical Align
        </label>
        <div className="flex gap-1">
          {([
            { value: 'top', label: 'Top' },
            { value: 'center', label: 'Center' },
            { value: 'bottom', label: 'Bottom' },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setProp((p: any) => { p.verticalAlign = value; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.verticalAlign ?? 'top') === value
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <WidthSetting />
    </div>
  );
};

export const ThreeColumnsBlock = ({ gap = 'md', width = '100%', verticalAlign = 'top' }: ThreeColumnsBlockProps) => {
  const gapClass = { none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-8' }[gap];
  const justifyClass = { top: 'justify-start', center: 'justify-center', bottom: 'justify-end' }[verticalAlign];

  return (
    <BlockWrapper width={width} className={`flex mb-4 ${gapClass}`} resizeRight>
      <div className={`flex-1 flex flex-col ${justifyClass}`}>
        <Element id="col-1" is={ColumnContainer} canvas />
      </div>
      <div className={`flex-1 flex flex-col ${justifyClass}`}>
        <Element id="col-2" is={ColumnContainer} canvas />
      </div>
      <div className={`flex-1 flex flex-col ${justifyClass}`}>
        <Element id="col-3" is={ColumnContainer} canvas />
      </div>
    </BlockWrapper>
  );
};

ThreeColumnsBlock.craft = {
  displayName: '3 Columns',
  props: { gap: 'md', width: '100%', verticalAlign: 'top' },
  related: { settings: ThreeColumnsSettings },
};
