import React from 'react';
import { useEditor } from '@craftjs/core';
import { Trash2 } from 'lucide-react';

const SettingsPanel = () => {
  const { selected, actions } = useEditor(state => {
    // state.events.selected is a Set<NodeId> in CraftJS 0.2.x
    const selectedSet = state.events.selected as Set<string>;
    const id = selectedSet.size > 0 ? [...selectedSet][0] : null;

    if (!id || !state.nodes[id]) return { selected: null };

    const node = state.nodes[id];
    return {
      selected: {
        id,
        displayName: (node.data.displayName || node.data.name) as string,
        isDeletable: id !== 'ROOT',
        // Use CraftJS-wrapped related component (includes NodeProvider context)
        settings: node.related?.settings as React.ComponentType | undefined,
      },
    };
  });

  if (!selected) {
    return (
      <div className="w-52 shrink-0 border-l border-border bg-background flex flex-col items-center justify-center p-6">
        <p className="text-xs text-muted-foreground/60 text-center leading-relaxed tracking-wide">
          Select a block to edit its properties
        </p>
      </div>
    );
  }

  const Settings = selected.settings;

  return (
    <div className="w-52 shrink-0 border-l border-border bg-background overflow-y-auto">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
          {selected.displayName}
        </p>
        {selected.isDeletable && (
          <button
            onClick={() => actions.delete(selected.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
            title="Delete block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {Settings ? (
        React.createElement(Settings)
      ) : (
        <div className="p-3">
          <p className="text-xs text-muted-foreground/60">No settings available.</p>
        </div>
      )}

      {selected.isDeletable && (
        <div className="p-3 border-t border-border mt-2">
          <button
            onClick={() => actions.delete(selected.id)}
            className="w-full py-1.5 text-xs tracking-widest uppercase border border-destructive/40 text-destructive/70 hover:bg-destructive/5 transition-colors"
          >
            Delete Block
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
