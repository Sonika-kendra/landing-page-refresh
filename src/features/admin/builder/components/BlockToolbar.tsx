import React from 'react';
import { useEditor, useNode } from '@craftjs/core';
import { ArrowUp, ArrowDown, Copy, Trash2 } from 'lucide-react';

export const BlockToolbar = () => {
  const { id } = useNode();
  const { actions, query } = useEditor();

  const node = query.node(id).get();
  const parentId = node.data.parent;
  if (!parentId) return null;

  const siblings: string[] =
    (query.node(parentId) as any).childNodes?.() ??
    (query.node(parentId).get().data as any).nodes ??
    [];

  const index = siblings.indexOf(id);
  const canMoveUp = index > 0;
  const canMoveDown = index < siblings.length - 1;

  const stop =
    (fn: () => void) => (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      fn();
    };

  const handleMoveUp = stop(() => {
    if (canMoveUp) actions.move(id, parentId, index - 1);
  });

  const handleMoveDown = stop(() => {
    if (canMoveDown) actions.move(id, parentId, index + 1);
  });

  const handleDuplicate = stop(() => {
    const { type, props } = node.data;
    try {
      const tree = query
        .parseReactElement(React.createElement(type as any, props))
        .toNodeTree();
      actions.addNodeTree(tree, parentId, index + 1);
    } catch {
      // block type may not support fresh parse (e.g. columns with children)
    }
  });

  const handleDelete = stop(() => {
    actions.delete(id);
  });

  const btn = (disabled = false) =>
    `p-1 transition-colors ${
      disabled
        ? 'opacity-25 cursor-not-allowed text-muted-foreground'
        : 'cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`;

  return (
    <div
      className="absolute top-0.5 right-0.5 z-30 flex items-center bg-background/95 border border-border shadow-sm"
      onPointerDown={e => e.stopPropagation()}
    >
      <button className={btn(!canMoveUp)} onClick={handleMoveUp} disabled={!canMoveUp} title="Move up">
        <ArrowUp className="w-3 h-3" />
      </button>
      <button className={btn(!canMoveDown)} onClick={handleMoveDown} disabled={!canMoveDown} title="Move down">
        <ArrowDown className="w-3 h-3" />
      </button>
      <span className="w-px h-3 bg-border mx-0.5" />
      <button className={btn()} onClick={handleDuplicate} title="Duplicate">
        <Copy className="w-3 h-3" />
      </button>
      <span className="w-px h-3 bg-border mx-0.5" />
      <button
        className={`${btn()} hover:!text-destructive`}
        onClick={handleDelete}
        title="Delete"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};
