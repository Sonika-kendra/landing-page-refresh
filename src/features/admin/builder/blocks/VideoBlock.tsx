import { useNode, useEditor as useCraftEditor } from '@craftjs/core';
import { Video, Link2 } from 'lucide-react';
import { BlockWrapper } from '../components/BlockWrapper';
import { WidthSetting } from '../components/WidthSetting';
import { InlineBlockBar, BarBtn, BarSep } from '../components/InlineBlockBar';

export interface VideoBlockProps {
  url?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  width?: string;
}

const getEmbedUrl = (url: string): string | null => {
  if (!url.trim()) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url;
  return null;
};

const PADDING: Record<string, string> = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%' };

export const VideoSettings = () => {
  const { actions: { setProp }, props } = useNode(node => ({
    props: node.data.props as VideoBlockProps,
  }));

  return (
    <div className="space-y-3 p-3">
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Video URL
        </label>
        <input
          value={props.url ?? ''}
          onChange={e => setProp((p: any) => { p.url = e.target.value; })}
          placeholder="YouTube or Vimeo URL"
          className="w-full border border-border px-2 py-1.5 text-xs bg-background focus:outline-none focus:border-foreground"
        />
        <p className="text-[10px] text-muted-foreground/60 mt-1">Supports YouTube and Vimeo links</p>
      </div>
      <div>
        <label className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground block mb-1.5">
          Aspect Ratio
        </label>
        <div className="flex gap-1">
          {(['16:9', '4:3', '1:1'] as const).map(r => (
            <button
              key={r}
              onClick={() => setProp((p: any) => { p.aspectRatio = r; })}
              className={`flex-1 py-1 text-xs border transition-colors ${
                (props.aspectRatio ?? '16:9') === r
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted/40'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <WidthSetting />
    </div>
  );
};

export const VideoBlock = ({
  url = '',
  aspectRatio = '16:9',
  width = '100%',
}: VideoBlockProps) => {
  const { actions: { setProp }, isSelected } = useNode(state => ({ isSelected: state.events.selected }));
  const { enabled } = useCraftEditor(state => ({ enabled: state.options.enabled }));
  const embedUrl = getEmbedUrl(url);

  const handleUrlEdit = () => {
    const newUrl = window.prompt('Video URL (YouTube or Vimeo):', url);
    if (newUrl !== null) setProp((p: any) => { p.url = newUrl; });
  };

  return (
    <BlockWrapper width={width} className="mb-4" resizeRight>
      {enabled && isSelected && (
        <InlineBlockBar>
          {(['16:9', '4:3', '1:1'] as const).map(r => (
            <BarBtn key={r} active={aspectRatio === r} onClick={() => setProp((p: any) => { p.aspectRatio = r; })} title={`Aspect ratio ${r}`}>{r}</BarBtn>
          ))}
          <BarSep />
          <BarBtn active={false} onClick={handleUrlEdit} title="Change video URL">
            <Link2 className="w-3 h-3" />
            <span>{url ? 'Change URL' : 'Set URL'}</span>
          </BarBtn>
        </InlineBlockBar>
      )}

      {embedUrl ? (
        <div style={{ position: 'relative', paddingBottom: PADDING[aspectRatio], height: 0, overflow: 'hidden' }}>
          <iframe
            src={embedUrl}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center h-32 bg-muted/20 border border-dashed border-border gap-2 cursor-pointer"
          onClick={enabled ? handleUrlEdit : undefined}
        >
          <Video className="w-6 h-6 text-muted-foreground/40" />
          <span className="text-xs text-muted-foreground/60 tracking-wide">
            {url ? 'Invalid video URL — paste a YouTube or Vimeo link' : 'Click to add a video URL'}
          </span>
        </div>
      )}
    </BlockWrapper>
  );
};

VideoBlock.craft = {
  displayName: 'Video',
  props: { url: '', aspectRatio: '16:9', width: '100%' },
  related: { settings: VideoSettings },
};
