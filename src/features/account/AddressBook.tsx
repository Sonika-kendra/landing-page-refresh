import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { addressesApi, AddressPayload } from '@/api/addresses';

interface Address {
  _id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode?: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

const blank: AddressPayload = {
  label: 'Home', fullName: '', line1: '', city: '', country: 'United Kingdom',
};

const AddressBook = () => {
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(AddressPayload & { _id?: string }) | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAddresses = () => {
    addressesApi.list()
      .then(res => setItems(res.data?.addresses ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAddresses(); }, []);

  const setDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id);
      setItems(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
    } catch {
      toast({ title: 'Failed to update default address', variant: 'destructive' });
    }
  };

  const remove = async (id: string) => {
    try {
      await addressesApi.remove(id);
      setItems(prev => prev.filter(a => a._id !== id));
    } catch {
      toast({ title: 'Failed to delete address', variant: 'destructive' });
    }
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing._id) {
        const { _id, ...payload } = editing;
        await addressesApi.update(_id, payload);
        setItems(prev => prev.map(a => a._id === _id ? { ...a, ...payload } : a));
      } else {
        const res = await addressesApi.create(editing as AddressPayload);
        setItems(prev => [...prev, res.data.address]);
      }
      setOpen(false);
    } catch {
      toast({ title: 'Failed to save address', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(blank); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {items.length === 0 && (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No saved addresses yet
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(a => (
          <Card key={a._id} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{a.label}</h3>
                {a.isDefault && <Badge variant="default" className="text-[10px]">Default</Badge>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing({ ...a }); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(a._id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-sm">{a.fullName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {a.line1}<br />
              {a.city}, {a.postalCode}<br />
              {a.country}<br />
              {a.phone}
            </p>
            {!a.isDefault && (
              <Button size="sm" variant="outline" className="mt-3 gap-1.5 h-8" onClick={() => setDefault(a._id)}>
                <Star className="h-3 w-3" /> Set as default
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing && '_id' in editing && editing._id ? 'Edit Address' : 'New Address'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Label</Label>
                <Input value={editing.label ?? ''} onChange={e => setEditing({ ...editing, label: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Full Name</Label>
                <Input value={editing.fullName} onChange={e => setEditing({ ...editing, fullName: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Address Line</Label>
                <Input value={editing.line1} onChange={e => setEditing({ ...editing, line1: e.target.value })} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={editing.city} onChange={e => setEditing({ ...editing, city: e.target.value })} />
              </div>
              <div>
                <Label>Postcode</Label>
                <Input value={editing.postalCode ?? ''} onChange={e => setEditing({ ...editing, postalCode: e.target.value })} />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={editing.country} onChange={e => setEditing({ ...editing, country: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={editing.phone ?? ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} />
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

export default AddressBook;
