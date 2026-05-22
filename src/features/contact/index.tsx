import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageLayout from '@/components/shared/layout/PageLayout';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

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
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded text-left ${idx === highlightedIdx ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                onMouseEnter={() => setHighlightedIdx(idx)}
                onClick={() => handleDialChange(c.code)}
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
        value={localNumber}
        onChange={e => handleNumberChange(e.target.value)}
      />
    </div>
  );
};

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  phone: z.string().trim().max(30).optional(),
  companyName: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Phone, title: 'Phone', details: ['+44 (0)207 404 0146'] },
  { icon: Mail, title: 'Email', details: ['sales@henigdiamonds.co.uk', 'info@henigdiamonds.co.uk'] },
  { icon: MapPin, title: 'Address', details: ['Henig Diamonds Suite Two,', 'First Floor,', '63-66 Hatton Garden,', 'London EC1N 8LE'] },
  { icon: Clock, title: 'Opening Hours', details: ['Monday To Thursday - 9:00am – 6:00pm', 'Friday - 9:00am – 3:30pm', 'Weekends & Bank Holidays Closed'] },
];

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', companyName: '', message: '' },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      console.log('Contact form submitted:', data);
      toast.success("Thank you! Your message has been sent. We'll get back to you shortly.");
      form.reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="bg-accent text-accent-foreground py-14 md:py-20">
        <div className="henig-container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="henig-heading-display mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out for enquiries, appointments, or bespoke requests.
          </motion.p>
        </div>
      </section>

      <section className="py-10 md:py-16 section-ivory">
        <div className="henig-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-8">
              {contactInfo.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                  <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-1">{item.title}</h3>
                    {item.details.map((line, j) => <p key={j} className="text-sm text-muted">{line}</p>)}
                  </div>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="rounded-sm overflow-hidden border border-border mt-8">
                <iframe
                  title="Henig Diamonds Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.5!2d-0.1088!3d51.5208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b4b4c4b4b4b%3A0x4b4b4b4b4b4b4b4b!2sHatton%20Garden%2C%20London!5e0!3m2!1sen!2suk!4v1234567890"
                  width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3 bg-card p-8 md:p-10 rounded-sm">
              <h2 className="font-serif text-2xl text-foreground mb-6">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="John Smith" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput value={field.value ?? ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Your company..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message *</FormLabel><FormControl><Textarea placeholder="Tell us how we can help..." className="min-h-[140px]" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="btn-henig-primary w-full sm:w-auto" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
