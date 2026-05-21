import { useNode, useEditor } from '@craftjs/core';

export function useBlockResize() {
  const { actions: { setProp } } = useNode();
  const { enabled } = useEditor(state => ({ enabled: state.options.enabled }));

  const makeHandler =
    (dir: 'right' | 'bottom') =>
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      // Lock pointer to the handle so fast drags don't lose tracking
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const parent = (e.currentTarget as HTMLElement).parentElement;
      if (!parent) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = parent.offsetWidth;
      const startH = parent.offsetHeight;
      const parentW = parent.parentElement?.offsetWidth ?? startW;

      const onMove = (me: PointerEvent) => {
        if (dir === 'right') {
          const rawPct = ((startW + me.clientX - startX) / parentW) * 100;
          const pct = Math.max(20, Math.min(100, Math.round(rawPct)));
          setProp((p: any) => { p.width = `${pct}%`; });
        } else {
          const newH = Math.max(8, startH + (me.clientY - startY));
          setProp((p: any) => { p.height = newH; });
        }
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };

  return {
    enabled,
    handleRightResize: makeHandler('right'),
    handleBottomResize: makeHandler('bottom'),
  };
}
