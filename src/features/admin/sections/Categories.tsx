import { useMemo, useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminPageHeader from '../components/AdminPageHeader';
import { categoriesApi } from '@/api/categories';
import { toast } from '@/hooks/use-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  isActive: boolean;
  sortOrder: number;
}

const blank: Omit<Category, '_id'> = { name: '', slug: '', parent: null, isActive: true, sortOrder: 0 };

const Categories = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<(Partial<Category> & { _id?: string }) | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCategories = () => {
    categoriesApi.list()
      .then(res => setItems(res.data?.categories ?? []))
      .catch(() => toast({ title: 'Failed to load categories', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCategories(); }, []);

  const tree = useMemo(() => items.filter(c => !c.parent), [items]);
  const childrenOf = (id: string) => items.filter(c => c.parent === id);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const openNew = () => {
    setEditing({ ...blank });
    setOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        name: editing.name,
        slug: editing.slug || editing.name?.toLowerCase().replace(/\s+/g, '-'),
        parent: editing.parent ?? null,
        isActive: editing.isActive ?? true,
        sortOrder: editing.sortOrder ?? 0,
      };
      if (editing._id) {
        await categoriesApi.update(editing._id, payload);
        setItems(prev => prev.map(i => i._id === editing._id ? { ...i, ...payload } : i));
      } else {
        const res = await categoriesApi.create(payload);
        setItems(prev => [...prev, res.data.category]);
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await categoriesApi.remove(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err: any) {
      toast({ title: err?.response?.data?.error ?? 'Failed to delete', variant: 'destructive' });
    }
  };

  const renderRow = (cat: Category, depth = 0) => {
    const kids = childrenOf(cat._id);
    const isExp = expanded.has(cat._id);
    return (
      <div key={cat._id}>
        <div
          className="flex items-center gap-3 py-3 px-4 border-b border-border hover:bg-muted/30 transition-colors"
          style={{ paddingLeft: 16 + depth * 24 }}
        >
          {kids.length > 0 ? (
            <button onClick={() => toggle(cat._id)} className="text-muted-foreground">
              {isExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : <div className="w-4" />}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">/{cat.slug}</p>
          </div>
          <Badge variant={cat.isActive ? 'default' : 'secondary'}>{cat.isActive ? 'active' : 'inactive'}</Badge>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(cat); setOpen(true); }}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(cat._id)}>
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
        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tree.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No categories yet</div>
        ) : (
          tree.map(t => renderRow(t))
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?._id ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={editing.name ?? ''} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug ?? ''} placeholder="auto-generated if empty" onChange={e => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <Label>Parent Category</Label>
                <Select
                  value={editing.parent ?? 'none'}
                  onValueChange={v => setEditing({ ...editing, parent: v === 'none' ? null : v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top-level)</SelectItem>
                    {items.filter(i => !i.parent && i._id !== editing._id).map(i => (
                      <SelectItem key={i._id} value={i._id}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editing.isActive ? 'active' : 'inactive'}
                  onValueChange={v => setEditing({ ...editing, isActive: v === 'active' })}
                >
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
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
