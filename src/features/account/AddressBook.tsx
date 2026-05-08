import { useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { mockAddresses, Address } from '@/data/commerce/orders';

const blank: Address = {
  id: '', label: '', fullName: '', line1: '', city: '', postcode: '', country: 'United Kingdom', phone: '',
};

const AddressBook = () => {
  const [items, setItems] = useState<Address[]>(mockAddresses);
  const [editing, setEditing] = useState<Address | null>(null);
  const [open, setOpen] = useState(false);

  const setDefault = (id: string) =>
    setItems(items.map(a => ({ ...a, isDefault: a.id === id })));

  const remove = (id: string) => setItems(items.filter(a => a.id !== id));

  const save = () => {
    if (!editing) return;
    if (editing.id) setItems(items.map(a => a.id === editing.id ? editing : a));
    else setItems([...items, { ...editing, id: `addr-${Date.now()}` }]);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(blank); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(a => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{a.label}</h3>
                {a.isDefault && <Badge variant="default" className="text-[10px]">Default</Badge>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(a); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(a.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-sm">{a.fullName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {a.line1}<br />
              {a.city}, {a.postcode}<br />
              {a.country}<br />
              {a.phone}
            </p>
            {!a.isDefault && (
              <Button size="sm" variant="outline" className="mt-3 gap-1.5 h-8" onClick={() => setDefault(a.id)}>
                <Star className="h-3 w-3" /> Set as default
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit Address' : 'New Address'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>Label</Label><Input value={editing.label} onChange={e => setEditing({ ...editing, label: e.target.value })} /></div>
              <div className="col-span-2"><Label>Full Name</Label><Input value={editing.fullName} onChange={e => setEditing({ ...editing, fullName: e.target.value })} /></div>
              <div className="col-span-2"><Label>Address Line</Label><Input value={editing.line1} onChange={e => setEditing({ ...editing, line1: e.target.value })} /></div>
              <div><Label>City</Label><Input value={editing.city} onChange={e => setEditing({ ...editing, city: e.target.value })} /></div>
              <div><Label>Postcode</Label><Input value={editing.postcode} onChange={e => setEditing({ ...editing, postcode: e.target.value })} /></div>
              <div><Label>Country</Label><Input value={editing.country} onChange={e => setEditing({ ...editing, country: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></div>
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

export default AddressBook;
