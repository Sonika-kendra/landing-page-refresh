import { useNode, useEditor as useCraftEditor } from '@craftjs/core';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { InlineBlockBar, BarBtn, BarSep } from '../components/InlineBlockBar';

export interface DividerBlockProps {
  spacing?: 'sm' | 'md' | 'lg';
  style?: 'solid' | 'dashed' | 'dotted';
  width?: string;
}

export const DividerSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as DividerBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Spacing
        </label>
        <div className="flex gap-1">
          {(['sm', 'md', 'lg'] as const).map(s => (
            <button
              key={s}
              onClick={() => setProp((p: any) => { p.spacing = s; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.spacing ?? 'md') === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Line Style
        </label>
        <div className="flex gap-1">
          {(['solid', 'dashed', 'dotted'] as const).map(s => (
            <button
              key={s}
              onClick={() => setProp((p: any) => { p.style = s; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.style ?? 'solid') === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <WidthSetting />
    </div>
  );
};

export const DividerBlock = ({
  spacing = 'md',
  style = 'solid',
  width = '100%',
}: DividerBlockProps) => {
  const { actions: { setProp }, isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));
  const paddingClass = { sm: 'my-4', md: 'my-8', lg: 'my-12' }[spacing];

  return (
    <BlockWrapper width={width} className={paddingClass} resizeRight>
      {enabled && isSelected && (
        <InlineBlockBar>
          <BarBtn active={style === 'solid'} onClick={() => setProp((p: any) => { p.style = 'solid'; })} title="Solid line">— Solid</BarBtn>
          <BarBtn active={style === 'dashed'} onClick={() => setProp((p: any) => { p.style = 'dashed'; })} title="Dashed line">- - Dashed</BarBtn>
          <BarBtn active={style === 'dotted'} onClick={() => setProp((p: any) => { p.style = 'dotted'; })} title="Dotted line">··· Dotted</BarBtn>
          <BarSep />
          <BarBtn active={spacing === 'sm'} onClick={() => setProp((p: any) => { p.spacing = 'sm'; })} title="Small spacing">S</BarBtn>
          <BarBtn active={spacing === 'md'} onClick={() => setProp((p: any) => { p.spacing = 'md'; })} title="Medium spacing">M</BarBtn>
          <BarBtn active={spacing === 'lg'} onClick={() => setProp((p: any) => { p.spacing = 'lg'; })} title="Large spacing">L</BarBtn>
        </InlineBlockBar>
      )}
      <hr style={{ borderStyle: style }} className="border-t border-border" />
    </BlockWrapper>
  );
};

DividerBlock.craft = {
  displayName: 'Divider',
  props: { spacing: 'md', style: 'solid', width: '100%' },
  related: { settings: DividerSettings },
};
