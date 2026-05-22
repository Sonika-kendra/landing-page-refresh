import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ChevronDown } from 'lucide-react';
import { authApi, ProfileUpdatePayload } from '@/api/auth';
import { toast } from '@/hooks/use-toast';

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

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = ({ value, onChange }: PhoneInputProps) => {
  const [dialCode, setDialCode] = useState('+44');
  const [localNumber, setLocalNumber] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const matched = PHONE_CODES.find(c => value.startsWith(c.code));
    if (matched) {
      setDialCode(matched.code);
      setLocalNumber(value.slice(matched.code.length).trim());
    } else {
      setDialCode('+44');
      setLocalNumber(value);
    }
  }, []);

  const selectedCountry = PHONE_CODES.find(c => c.code === dialCode) ?? PHONE_CODES[0];
  const filtered = search.trim()
    ? PHONE_CODES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
      )
    : PHONE_CODES;

  useEffect(() => { setHighlightedIdx(0); }, [search]);
  useEffect(() => { itemRefs.current[highlightedIdx]?.scrollIntoView({ block: 'nearest' }); }, [highlightedIdx]);

  const handleDialChange = (code: string) => {
    setDialCode(code);
    onChange(localNumber.trim() ? `${code}${localNumber.trim()}` : '');
    setDropOpen(false);
    setSearch('');
  };

  const handleNumberChange = (num: string) => {
    setLocalNumber(num);
    onChange(num.trim() ? `${dialCode}${num.trim()}` : '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = filtered[highlightedIdx];
      if (c) handleDialChange(c.code);
    } else if (e.key === 'Escape') {
      setDropOpen(false);
      setSearch('');
    }
  };

  return (
    <div className="flex">
      <Popover open={dropOpen} onOpenChange={v => { setDropOpen(v); if (!v) setSearch(''); }}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="h-10 flex shrink-0 items-center gap-1.5 rounded-l-md rounded-r-none border border-r-0 border-input bg-background px-2.5 text-sm hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 mb-2 text-sm"
            autoFocus
          />
          <ScrollArea className="h-56">
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No results</p>
            )}
            {filtered.map((c, idx) => (
              <button
                key={c.code}
                ref={el => { itemRefs.current[idx] = el; }}
                type="button"
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-left ${idx === highlightedIdx ? 'bg-accent' : 'hover:bg-accent/60'}`}
                onMouseEnter={() => setHighlightedIdx(idx)}
                onClick={() => handleDialChange(c.code)}
              >
                <img
                  src={`https://flagcdn.com/w20/${c.cc}.png`}
                  alt={c.name}
                  className="w-5 h-3.5 object-cover rounded-sm shrink-0"
                />
                <span className="font-medium w-10 shrink-0">{c.code}</span>
                <span className="text-muted-foreground truncate">{c.name}</span>
              </button>
            ))}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Input
        className="rounded-l-none"
        type="tel"
        placeholder="Phone number"
        value={localNumber}
        onChange={e => handleNumberChange(e.target.value)}
      />
    </div>
  );
};

const Profile = () => {
  const [profileForm, setProfileForm] = useState<ProfileUpdatePayload>({
    title: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    mobileTelephone: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    authApi
      .getProfile()
      .then((res) => {
        const u = res.data as any;
        setProfileForm({
          title: u.title ?? '',
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          companyName: u.companyName ?? '',
          phone: u.phone ?? '',
          mobileTelephone: u.mobileTelephone ?? '',
        });
      })
      .catch(() => toast({ title: 'Failed to load profile', variant: 'destructive' }))
      .finally(() => setFetchLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      await authApi.updateProfile(profileForm);
      toast({ title: 'Profile updated successfully' });
    } catch {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setProfileLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="p-6 max-w-4xl">
      <h2 className="font-medium mb-4">Personal Information</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <Label>Title</Label>
          <Select
            value={profileForm.title}
            onValueChange={(value) => setProfileForm((f) => ({ ...f, title: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Mrs">Mrs</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
              <SelectItem value="Dr">Dr</SelectItem>
              <SelectItem value="Prof">Prof</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Company Name</Label>
          <Input
            value={profileForm.companyName}
            onChange={(e) => setProfileForm((f) => ({ ...f, companyName: e.target.value }))}
          />
        </div>
        <div>
          <Label>First Name</Label>
          <Input
            value={profileForm.firstName}
            onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            value={profileForm.lastName}
            onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
            value={profileForm.phone}
            onChange={(v) => setProfileForm((f) => ({ ...f, phone: v }))}
          />
        </div>
        <div>
          <Label>Mobile</Label>
          <PhoneInput
            value={profileForm.mobileTelephone}
            onChange={(v) => setProfileForm((f) => ({ ...f, mobileTelephone: v }))}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleProfileSave} disabled={profileLoading}>
          {profileLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

export default Profile;
