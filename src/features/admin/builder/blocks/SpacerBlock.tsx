import { useNode, useEditor as useCraftEditor } from '@craftjs/core';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { InlineBlockBar, BarBtn, BarSep } from '../components/InlineBlockBar';

export interface SpacerBlockProps {
  height?: number;
  width?: string;
}

export const SpacerSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as SpacerBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Height (px): {props.height ?? 40}
        </label>
        <input
          type="range"
          min={8}
          max={160}
          step={8}
          value={props.height ?? 40}
          onChange={e => setProp((p: any) => { p.height = Number(e.target.value); })}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>8px</span>
          <span>160px</span>
        </div>
      </div>
      <WidthSetting />
    </div>
  );
};

const PRESETS = [16, 32, 48, 64, 96] as const;

export const SpacerBlock = ({ height = 40, width = '100%' }: SpacerBlockProps) => {
  const { actions: { setProp }, isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));

  return (
    <BlockWrapper
      width={width}
      style={{ height }}
      className={`${enabled ? 'border border-dashed border-transparent hover:border-border cursor-pointer' : ''} ${
        enabled && isSelected ? 'border-primary/40 bg-primary/5' : ''
      }`}
      resizeRight
      resizeBottom
    >
      {enabled && isSelected && (
        <div className="absolute inset-x-0 top-0 z-10">
          <InlineBlockBar>
            <BarBtn active={false} onClick={() => setProp((p: any) => { p.height = Math.max(8, (height ?? 40) - 8); })} title="Decrease height">−</BarBtn>
            <span className="text-[10px] text-muted-foreground px-1">{height}px</span>
            <BarBtn active={false} onClick={() => setProp((p: any) => { p.height = Math.min(160, (height ?? 40) + 8); })} title="Increase height">+</BarBtn>
            <BarSep />
            {PRESETS.map(h => (
              <BarBtn key={h} active={height === h} onClick={() => setProp((p: any) => { p.height = h; })} title={`${h}px`}>{h}</BarBtn>
            ))}
          </InlineBlockBar>
        </div>
      )}
      {enabled && isSelected && (
        <div className="flex items-end justify-center h-full pb-1 pointer-events-none">
          <span className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">{height}px</span>
        </div>
      )}
    </BlockWrapper>
  );
};

SpacerBlock.craft = {
  displayName: 'Spacer',
  props: { height: 40, width: '100%' },
  related: { settings: SpacerSettings },
};
