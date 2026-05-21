import { useRef } from 'react';
import { useNode, useEditor as useCraftEditor } from '@craftjs/core';
import { ImagePlus, AlignLeft, AlignCenter, AlignRight, Maximize2 } from 'lucide-react';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { PaddingSetting } from '../components/PaddingSetting';
import { InlineBlockBar, BarBtn, BarSep } from '../components/InlineBlockBar';

export interface ImageBlockProps {
  src?: string;
  alt?: string;
  caption?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  height?: number;
  paddingTop?: number;
  paddingBottom?: number;
  onUploadImage?: (file: File) => Promise<string>;
}

export const ImageSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as ImageBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Image URL
        </label>
        <input
          type="text"
          value={props.src ?? ''}
          onChange={e => setProp((p: any) => { p.src = e.target.value; })}
          placeholder="https://..."
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground"
        />
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Alt Text
        </label>
        <input
          type="text"
          value={props.alt ?? ''}
          onChange={e => setProp((p: any) => { p.alt = e.target.value; })}
          placeholder="Describe the image"
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground"
        />
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Caption
        </label>
        <input
          type="text"
          value={props.caption ?? ''}
          onChange={e => setProp((p: any) => { p.caption = e.target.value; })}
          placeholder="Optional caption"
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground"
        />
      </div>
      <WidthSetting />
      <PaddingSetting />
    </div>
  );
};

export const ImageBlock = ({
  src = '',
  alt = '',
  caption = '',
  align = 'center',
  width = '100%',
  height,
  paddingTop = 0,
  paddingBottom = 0,
  onUploadImage,
}: ImageBlockProps) => {
  const { actions: { setProp }, isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!onUploadImage) return;
    try {
      const url = await onUploadImage(file);
      setProp((p: any) => { p.src = url; });
    } catch { /* upload failed */ }
  };

  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }[align];
  const imgAlignClass = { left: 'mr-auto', center: 'mx-auto', right: 'ml-auto' }[align];

  return (
    <BlockWrapper width={width} className="mb-6" style={{ paddingTop, paddingBottom }} resizeRight resizeBottom>
      {enabled && isSelected && (
        <InlineBlockBar>
          <BarBtn active={align === 'left'} onClick={() => setProp((p: any) => { p.align = 'left'; })} title="Align left"><AlignLeft className="w-3 h-3" /></BarBtn>
          <BarBtn active={align === 'center'} onClick={() => setProp((p: any) => { p.align = 'center'; })} title="Align center"><AlignCenter className="w-3 h-3" /></BarBtn>
          <BarBtn active={align === 'right'} onClick={() => setProp((p: any) => { p.align = 'right'; })} title="Align right"><AlignRight className="w-3 h-3" /></BarBtn>
          <BarSep />
          {(['100%', '75%', '50%', '33%'] as const).map(w => (
            <BarBtn key={w} active={width === w} onClick={() => setProp((p: any) => { p.width = w; })} title={`Width ${w}`}>{w}</BarBtn>
          ))}
          {src && (
            <>
              <BarSep />
              <BarBtn active={false} onClick={() => inputRef.current?.click()} title="Replace image"><Maximize2 className="w-3 h-3" /><span>Replace</span></BarBtn>
            </>
          )}
        </InlineBlockBar>
      )}

      <figure style={{ margin: 0 }} className={alignClass}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`object-cover ${imgAlignClass} block`}
            style={{ width: '100%', ...(height ? { height } : { maxHeight: 500 }) }}
          />
        ) : enabled ? (
          <div
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border bg-muted/10 cursor-pointer py-12 w-full"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground tracking-wide uppercase">Click to upload image</p>
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              if (onUploadImage) handleUpload(file);
              else setProp((p: any) => { p.src = URL.createObjectURL(file); });
            }
            e.target.value = '';
          }}
        />

        {/* Editable caption */}
        {(caption || enabled) && (
          <figcaption
            contentEditable={enabled}
            suppressContentEditableWarning
            onBlur={(e: any) => enabled && setProp((p: any) => { p.caption = e.currentTarget.innerText; })}
            className={`text-xs text-muted-foreground mt-2 italic outline-none ${alignClass} ${enabled && !caption ? 'opacity-40' : ''}`}
          >
            {caption || (enabled ? 'Add a caption…' : '')}
          </figcaption>
        )}
      </figure>
    </BlockWrapper>
  );
};

ImageBlock.craft = {
  displayName: 'Image',
  props: { src: '', alt: '', caption: '', align: 'center', width: '100%', height: undefined, paddingTop: 0, paddingBottom: 0 },
  related: { settings: ImageSettings },
};
