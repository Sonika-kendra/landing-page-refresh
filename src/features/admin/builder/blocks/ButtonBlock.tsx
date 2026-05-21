import { useRef, useEffect } from 'react';
import { useNode, useEditor as useCraftEditor } from '@craftjs/core';
import { AlignLeft, AlignCenter, AlignRight, Link2 } from 'lucide-react';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { PaddingSetting } from '../components/PaddingSetting';
import { InlineBlockBar, BarBtn, BarSep } from '../components/InlineBlockBar';

export interface ButtonBlockProps {
  label?: string;
  url?: string;
  align?: 'left' | 'center' | 'right';
  variant?: 'filled' | 'outline';
  width?: string;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export const ButtonSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as ButtonBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Label
        </label>
        <input
          type="text"
          value={props.label ?? ''}
          onChange={e => setProp((p: any) => { p.label = e.target.value; })}
          placeholder="Button Text"
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground"
        />
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          URL
        </label>
        <input
          type="text"
          value={props.url ?? ''}
          onChange={e => setProp((p: any) => { p.url = e.target.value; })}
          placeholder="https://"
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground"
        />
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Style
        </label>
        <div className="flex gap-1">
          {(['filled', 'outline'] as const).map(v => (
            <button
              key={v}
              onClick={() => setProp((p: any) => { p.variant = v; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.variant ?? 'filled') === v
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Alignment
        </label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map(a => (
            <button
              key={a}
              onClick={() => setProp((p: any) => { p.align = a; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.align ?? 'left') === a
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {a[0].toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <WidthSetting />
      <PaddingSetting />
    </div>
  );
};

export const ButtonBlock = ({
  label = 'Click Here',
  url = '#',
  align = 'left',
  variant = 'filled',
  width = '100%',
  height,
  paddingTop = 0,
  paddingBottom = 0,
}: ButtonBlockProps) => {
  const { actions: { setProp }, isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));
  const labelRef = useRef<HTMLSpanElement>(null);

  // Sync label to the contentEditable span when changed externally (undo/redo)
  useEffect(() => {
    const el = labelRef.current;
    if (el && document.activeElement !== el) {
      el.textContent = label ?? '';
    }
  }, [label]);

  const alignClass = { left: 'justify-start', center: 'justify-center', right: 'justify-end' }[align];
  const btnClass =
    variant === 'filled'
      ? 'bg-foreground text-background px-6 py-2.5 text-xs tracking-widest uppercase'
      : 'border border-foreground text-foreground px-6 py-2.5 text-xs tracking-widest uppercase';

  const handleUrlEdit = () => {
    const newUrl = window.prompt('Button URL:', url);
    if (newUrl !== null) setProp((p: any) => { p.url = newUrl; });
  };

  return (
    <BlockWrapper
      width={width}
      className="mb-4"
      style={{ ...(height ? { minHeight: height } : {}), paddingTop, paddingBottom }}
      resizeRight={enabled}
      resizeBottom={enabled}
    >
      {enabled && isSelected && (
        <InlineBlockBar>
          <BarBtn active={variant === 'filled'} onClick={() => setProp((p: any) => { p.variant = 'filled'; })} title="Filled style">Filled</BarBtn>
          <BarBtn active={variant === 'outline'} onClick={() => setProp((p: any) => { p.variant = 'outline'; })} title="Outline style">Outline</BarBtn>
          <BarSep />
          <BarBtn active={align === 'left'} onClick={() => setProp((p: any) => { p.align = 'left'; })} title="Align left"><AlignLeft className="w-3 h-3" /></BarBtn>
          <BarBtn active={align === 'center'} onClick={() => setProp((p: any) => { p.align = 'center'; })} title="Align center"><AlignCenter className="w-3 h-3" /></BarBtn>
          <BarBtn active={align === 'right'} onClick={() => setProp((p: any) => { p.align = 'right'; })} title="Align right"><AlignRight className="w-3 h-3" /></BarBtn>
          <BarSep />
          <BarBtn active={false} onClick={handleUrlEdit} title="Edit URL"><Link2 className="w-3 h-3" /><span>{url && url !== '#' ? url.replace(/^https?:\/\//, '').slice(0, 20) : 'Set URL'}</span></BarBtn>
        </InlineBlockBar>
      )}

      <div className={`flex ${alignClass}`}>
        {enabled ? (
          <span
            ref={labelRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => setProp((p: any) => { p.label = e.currentTarget.textContent ?? ''; })}
            className={`${btnClass} outline-none cursor-text`}
          />
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className={btnClass}>
            {label}
          </a>
        )}
      </div>
    </BlockWrapper>
  );
};

ButtonBlock.craft = {
  displayName: 'Button',
  props: { label: 'Click Here', url: '#', align: 'left', variant: 'filled', width: '100%', height: undefined, paddingTop: 0, paddingBottom: 0 },
  related: { settings: ButtonSettings },
};
