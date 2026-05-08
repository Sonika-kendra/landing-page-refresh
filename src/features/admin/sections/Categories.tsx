import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import { mockCategories, Category } from '@/data/commerce/categories';

const Categories = () => {
  const [items, setItems] = useState<Category[]>(mockCategories);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['cat-1', 'cat-4']));
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);

  const tree = useMemo(() => items.filter(c => c.parentId === null), [items]);
  const childrenOf = (id: string) => items.filter(c => c.parentId === id);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const openNew = () => {
    setEditing({ id: '', name: '', slug: '', parentId: null, productCount: 0, status: 'active', createdAt: new Date().toISOString() });
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;
    if (editing.id) {
      setItems(items.map(i => i.id === editing.id ? editing : i));
    } else {
      setItems([...items, { ...editing, id: `cat-${Date.now()}` }]);
    }
    setOpen(false);
  };

  const remove = (id: string) => setItems(items.filter(i => i.id !== id && i.parentId !== id));

  const renderRow = (cat: Category, depth = 0) => {
    const kids = childrenOf(cat.id);
    const isExp = expanded.has(cat.id);
    return (
      <div key={cat.id}>
        <div
          className="flex items-center gap-3 py-3 px-4 border-b border-border hover:bg-muted/30 transition-colors"
          style={{ paddingLeft: 16 + depth * 24 }}
        >
          {kids.length > 0 ? (
            <button onClick={() => toggle(cat.id)} className="text-muted-foreground">
              {isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : <div className="w-4" />}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">/{cat.slug}</p>
          </div>
          <span className="text-xs text-muted-foreground">{cat.productCount} products</span>
          <Badge variant={cat.status === 'active' ? 'default' : 'secondary'}>{cat.status}</Badge>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(cat); setOpen(true); }}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(cat.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {isExp && kids.map(k => renderRow(k, depth + 1))}
      </div>
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage product categories and subcategories"
        actions={<Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> New Category</Button>}
      />

      <Card className="overflow-hidden">
        <div className="bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
          Category Tree
        </div>
        {tree.map(t => renderRow(t))}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <Label>Parent Category</Label>
                <Select
                  value={editing.parentId ?? 'none'}
                  onValueChange={v => setEditing({ ...editing, parentId: v === 'none' ? null : v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top-level)</SelectItem>
                    {items.filter(i => i.parentId === null && i.id !== editing.id).map(i => (
                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editing.status} onValueChange={(v: 'active' | 'inactive') => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
