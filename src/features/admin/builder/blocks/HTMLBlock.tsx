import { useNode, useEditor } from '@craftjs/core';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { PaddingSetting } from '../components/PaddingSetting';
import { Code2 } from 'lucide-react';

export interface HTMLBlockProps {
  html?: string;
  width?: string;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export const HTMLSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as HTMLBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          HTML Code
        </label>
        <textarea
          value={props.html ?? ''}
          onChange={e => setProp((p: any) => { p.html = e.target.value; })}
          placeholder="<p>Enter your HTML here...</p>"
          rows={10}
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground font-mono resize-none leading-relaxed"
        />
      </div>
      <WidthSetting />
      <PaddingSetting />
    </div>
  );
};

export const HTMLBlock = ({
  html = '',
  width = '100%',
  height,
  paddingTop = 0,
  paddingBottom = 0,
}: HTMLBlockProps) => {
  const { enabled } = useEditor(state => ({ enabled: state.options.enabled }));

  return (
    <BlockWrapper width={width} className="mb-4" style={{ ...(height ? { minHeight: height } : {}), paddingTop, paddingBottom }} resizeRight resizeBottom>
      {html.trim() ? (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className={`${enabled ? 'pointer-events-none select-none' : ''}`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-20 bg-muted/20 border border-dashed border-border gap-2">
          <Code2 className="w-5 h-5 text-muted-foreground/40" />
          <span className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">
            Custom HTML — paste code in settings
          </span>
        </div>
      )}
    </BlockWrapper>
  );
};

HTMLBlock.craft = {
  displayName: 'HTML',
  props: { html: '', width: '100%', height: undefined, paddingTop: 0, paddingBottom: 0 },
  related: { settings: HTMLSettings },
};
