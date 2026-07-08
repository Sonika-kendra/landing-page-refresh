import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Star, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { addressesApi, AddressPayload } from '@/api/addresses';

const PHONE_CODES = [
  { code: '+44', cc: 'gb', name: 'United Kingdom' },
  { code: '+1', cc: 'us', name: 'United States' },
  { code: '+971', cc: 'ae', name: 'UAE' },
  { code: '+91', cc: 'in', name: 'India' },
  { code: '+353', cc: 'ie', name: 'Ireland' },
  { code: '+33', cc: 'fr', name: 'France' },
  { code: '+49', cc: 'de', name: 'Germany' },
  { code: '+39', cc: 'it', name: 'Italy' },
  { code: '+34', cc: 'es', name: 'Spain' },
  { code: '+31', cc: 'nl', name: 'Netherlands' },
  { code: '+41', cc: 'ch', name: 'Switzerland' },
  { code: '+32', cc: 'be', name: 'Belgium' },
  { code: '+43', cc: 'at', name: 'Austria' },
  { code: '+351', cc: 'pt', name: 'Portugal' },
  { code: '+46', cc: 'se', name: 'Sweden' },
  { code: '+47', cc: 'no', name: 'Norway' },
  { code: '+45', cc: 'dk', name: 'Denmark' },
  { code: '+358', cc: 'fi', name: 'Finland' },
  { code: '+30', cc: 'gr', name: 'Greece' },
  { code: '+48', cc: 'pl', name: 'Poland' },
  { code: '+61', cc: 'au', name: 'Australia' },
  { code: '+64', cc: 'nz', name: 'New Zealand' },
  { code: '+65', cc: 'sg', name: 'Singapore' },
  { code: '+852', cc: 'hk', name: 'Hong Kong' },
  { code: '+81', cc: 'jp', name: 'Japan' },
  { code: '+82', cc: 'kr', name: 'South Korea' },
  { code: '+86', cc: 'cn', name: 'China' },
  { code: '+966', cc: 'sa', name: 'Saudi Arabia' },
  { code: '+974', cc: 'qa', name: 'Qatar' },
  { code: '+965', cc: 'kw', name: 'Kuwait' },
  { code: '+973', cc: 'bh', name: 'Bahrain' },
  { code: '+968', cc: 'om', name: 'Oman' },
  { code: '+20', cc: 'eg', name: 'Egypt' },
  { code: '+27', cc: 'za', name: 'South Africa' },
  { code: '+55', cc: 'br', name: 'Brazil' },
  { code: '+52', cc: 'mx', name: 'Mexico' },
  { code: '+7', cc: 'ru', name: 'Russia' },
];

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
  const [dialCode, setDialCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneDropOpen, setPhoneDropOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedCountry = PHONE_CODES.find(c => c.code === dialCode) ?? PHONE_CODES[0];
  const filteredCountries = countrySearch.trim()
    ? PHONE_CODES.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.includes(countrySearch)
      )
    : PHONE_CODES;

  useEffect(() => { setHighlightedIdx(0); }, [countrySearch]);

  useEffect(() => {
    itemRefs.current[highlightedIdx]?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIdx]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIdx(i => Math.min(i + 1, filteredCountries.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const country = filteredCountries[highlightedIdx];
      if (country) { setDialCode(country.code); setPhoneDropOpen(false); setCountrySearch(''); }
    } else if (e.key === 'Escape') {
      setPhoneDropOpen(false);
      setCountrySearch('');
    }
  };

  const loadAddresses = () => {
    addressesApi.list()
      .then(res => setItems(res.data?.addresses ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAddresses(); }, []);

  useEffect(() => {
    if (open && editing) {
      const phone = editing.phone ?? '';
      const matched = PHONE_CODES.find(c => phone.startsWith(c.code));
      if (matched) {
        setDialCode(matched.code);
        setPhoneNumber(phone.slice(matched.code.length).trim());
      } else {
        setDialCode('+44');
        setPhoneNumber(phone);
      }
    }
  }, [open]);

  const setDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id);
      setItems(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
    } catch {
      toast({ title: 'Failed to update default address', variant: 'destructive' });
    }
  };

  const unsetDefault = async (id: string) => {
    try {
      await addressesApi.unsetDefault(id);
      setItems(prev => prev.map(a => a._id === id ? { ...a, isDefault: false } : a));
    } catch {
      toast({ title: 'Failed to remove default address', variant: 'destructive' });
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
      const phone = phoneNumber.trim() ? `${dialCode}${phoneNumber.trim()}` : undefined;
      const editingWithPhone = { ...editing, phone };
      if (editing._id) {
        const { _id, ...payload } = editingWithPhone;
        await addressesApi.update(_id, payload);
        setItems(prev => prev.map(a => a._id === _id ? { ...a, ...payload } : a));
      } else {
        const res = await addressesApi.create(editingWithPhone as AddressPayload);
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
        <LoadingSpinner size={24} />
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
            {a.isDefault ? (
              <Button size="sm" variant="outline" className="mt-3 gap-1.5 h-8 text-muted-foreground" onClick={() => unsetDefault(a._id)}>
                <Star className="h-3 w-3" /> Remove as default
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="mt-3 gap-1.5 h-8" onClick={() => setDefault(a._id)}>
                <Star className="h-3 w-3" /> Set as default
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing && '_id' in editing && editing._id ? 'Edit Address' : 'New Address'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Address Line</Label>
                <textarea
                  rows={3}
                  value={editing.line1}
                  onChange={e => setEditing({ ...editing, line1: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
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
                <select
                  value={editing.country}
                  onChange={e => {
                    const selected = PHONE_CODES.find(c => c.name === e.target.value);
                    if (selected) setDialCode(selected.code);
                    setEditing({ ...editing, country: e.target.value });
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {PHONE_CODES.map(c => (
                    <option key={c.cc} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Phone</Label>
                <div className="flex">
                  <Popover open={phoneDropOpen} onOpenChange={v => { setPhoneDropOpen(v); if (!v) setCountrySearch(''); }}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 flex shrink-0 items-center gap-1.5 rounded-l-md rounded-r-none border border-r-0 border-input bg-background px-2.5 text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <img
                          src={`https://flagcdn.com/w20/${selectedCountry.cc}.png`}
                          alt={selectedCountry.name}
                          className="w-5 h-3.5 object-cover rounded-sm"
                        />
                        <span className="text-xs font-medium">{selectedCountry.code}</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="start">
                      <Input
                        placeholder="Search country..."
                        value={countrySearch}
                        onChange={e => setCountrySearch(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="h-8 mb-2 text-sm"
                        autoFocus
                      />
                      <ScrollArea className="h-56">
                        {filteredCountries.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">No results</p>
                        )}
                        {filteredCountries.map((c, idx) => (
                          <button
                            key={c.code}
                            ref={el => { itemRefs.current[idx] = el; }}
                            type="button"
                            className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-left ${idx === highlightedIdx ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                            onMouseEnter={() => setHighlightedIdx(idx)}
                            onClick={() => { setDialCode(c.code); setPhoneDropOpen(false); setCountrySearch(''); }}
                          >
                            <img
                              src={`https://flagcdn.com/w20/${c.cc}.png`}
                              alt={c.name}
                              className="w-5 h-3.5 object-cover rounded-sm shrink-0"
                            />
                            <span className="font-medium w-10 shrink-0">{c.code}</span>
                            <span className={`truncate ${idx === highlightedIdx ? 'text-accent-foreground/80' : 'text-muted-foreground'}`}>{c.name}</span>
                          </button>
                        ))}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  <Input
                    className="rounded-l-none"
                    type="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Label</Label>
                <Input value={editing.label ?? ''} onChange={e => setEditing({ ...editing, label: e.target.value })} />
              </div>
              <div>
                <Label>Full Name</Label>
                <Input value={editing.fullName} onChange={e => setEditing({ ...editing, fullName: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <LoadingSpinner size={16} className="mr-2" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressBook;
