import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings2, Plus, Trash2, GripVertical, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { adminApi, SiteConfig, FilterConfigStatus, FilterConfigRebuildResult } from '@/api/admin';
import { announcementBar as staticConfig, brandConfig } from '@/config/theme';
import LoadingSpinner from '@/components/shared/common/LoadingSpinner';

const SOCIAL_LINK_FIELDS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'whatsApp', label: 'WhatsApp' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'youtube', label: 'YouTube' },
] as const;

const FILTER_KEY_LABELS: Record<string, string> = {
  metals: 'Metals',
  shapes: 'Shapes',
  stockTypes: 'Stock Types',
  ringSizes: 'Ring Sizes',
  certificates: 'Certificates',
  caratValues: 'Carat Values',
  subcategories: 'Subcategories',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// ── Types ─────────────────────────────────────────────────────────────────────

type AnnStyle = 'normal' | 'bold' | 'italic' | 'bold-italic';
interface AnnMsg { text: string; link?: string; style?: AnnStyle }

// Normalise whatever is stored in the DB (plain string or object) to AnnMsg
const toAnnMsg = (raw: unknown): AnnMsg =>
  typeof raw === 'string' ? { text: raw } : (raw as AnnMsg);

// Strip outer <p> wrapper TinyMCE adds so we store clean inline HTML
const cleanHtml = (html: string) =>
  html.replace(/^<p[^>]*>([\s\S]*?)<\/p>$/i, '$1').trim();

// Strip all tags for list preview
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();

// Convert legacy { text, link, style } to HTML for the editor initial value
const legacyToHtml = (msg: AnnMsg): string => {
  let content = msg.text;
  if (msg.style === 'bold') content = `<strong>${content}</strong>`;
  else if (msg.style === 'italic') content = `<em>${content}</em>`;
  else if (msg.style === 'bold-italic') content = `<strong><em>${content}</em></strong>`;
  if (msg.link) content = `<a href="${msg.link}" target="_blank" rel="noopener noreferrer">${content}</a>`;
  return content;
};

// ── Announcement Bar Manager ──────────────────────────────────────────────────

interface AnnouncementManagerProps {
  config: SiteConfig | null;
  isLoading: boolean;
}

const AnnouncementManager = ({ config, isLoading }: AnnouncementManagerProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Track the DB _id in a ref so subsequent saves use update without waiting
  // for the parent query to refetch after the initial create.
  const configIdRef = useRef<string | null>(config?._id ?? null);

  const initEnabled = config?.fields?.enabled !== undefined
    ? (config.fields.enabled as boolean)
    : staticConfig.enabled;

  const initMessages: AnnMsg[] = Array.isArray(config?.fields?.messages)
    ? (config!.fields.messages as unknown[]).map(toAnnMsg)
    : staticConfig.messages.map(t => ({ text: t }));

  const [enabled, setEnabled] = useState(initEnabled);
  const [messages, setMessages] = useState<AnnMsg[]>(initMessages);

  // New-message form
  const [newHtml, setNewHtml] = useState('');
  const [addKey, setAddKey] = useState(0);

  // Inline edit state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editHtml, setEditHtml] = useState('');

  useEffect(() => {
    if (!config?._id || config._id === configIdRef.current) return;
    // First time a real DB config is loaded — sync local state so subsequent
    // saves don't clobber the DB with stale staticConfig fallback values.
    configIdRef.current = config._id;
    setEnabled(
      config.fields.enabled !== undefined
        ? (config.fields.enabled as boolean)
        : staticConfig.enabled
    );
    setMessages(
      Array.isArray(config.fields.messages)
        ? (config.fields.messages as unknown[]).map(toAnnMsg)
        : staticConfig.messages.map(t => ({ text: t }))
    );
  }, [config?._id]);

  const saveMutation = useMutation({
    mutationFn: (data: { enabled: boolean; messages: AnnMsg[] }) => {
      const id = configIdRef.current;
      if (id) {
        return adminApi.updateConfig(id, { type: 'announcement_bar', fields: data });
      }
      return adminApi.createConfig({ type: 'announcement_bar', fields: data });
    },
    onSuccess: (res) => {
      configIdRef.current = res.data._id;
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      toast({ title: 'Saved' });
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.errors?.msg || err?.message || 'Unknown error';
      toast({ title: 'Save failed', description: String(detail), variant: 'destructive' });
    },
  });

  const persist = (nextEnabled: boolean, nextMessages: AnnMsg[]) => {
    saveMutation.mutate({ enabled: nextEnabled, messages: nextMessages });
  };

  const handleToggle = (val: boolean) => {
    setEnabled(val);
    persist(val, messages);
  };

  const handleAddMessage = () => {
    const html = cleanHtml(newHtml);
    if (!html) return;
    const updated = [...messages, { text: html }];
    setMessages(updated);
    setNewHtml('');
    setAddKey(k => k + 1);
    persist(enabled, updated);
  };

  const handleRemoveMessage = (index: number) => {
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated);
    persist(enabled, updated);
  };

  const handleStartEdit = (index: number) => {
    const msg = messages[index];
    // Convert legacy format to HTML for the editor
    const html = (msg.link || msg.style) ? legacyToHtml(msg) : msg.text;
    setEditHtml(html);
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const html = cleanHtml(editHtml);
    const updated = [...messages];
    updated[editingIndex] = { text: html || updated[editingIndex].text };
    setMessages(updated);
    setEditingIndex(null);
    persist(enabled, updated);
  };

  if (isLoading) {
    return (
      <div className="bg-background rounded-sm border border-border p-5 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-background rounded-sm border border-border p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase">Announcement Bar</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Changes are saved automatically.</p>
        </div>
        <div className="flex items-center gap-2">
          {saveMutation.isPending && (
            <span className="text-[10px] text-muted-foreground tracking-wider">Saving…</span>
          )}
          <Label htmlFor="ann-enabled" className="text-xs text-muted-foreground">
            {enabled ? 'Enabled' : 'Disabled'}
          </Label>
          <Switch
            id="ann-enabled"
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={saveMutation.isPending}
          />
        </div>
      </div>

      {/* Messages list */}
      <div className="space-y-2">
        <Label className="text-xs tracking-wider uppercase text-muted-foreground">Messages</Label>

        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 text-center border border-dashed border-border rounded-sm">
            No messages yet. Add one below.
          </p>
        ) : (
          <div className="space-y-1.5">
            {messages.map((msg, i) => (
              <div key={i} className="bg-muted/30 rounded-sm px-3 py-2 group">
                {editingIndex === i ? (
                  <div className="space-y-1.5">
                    <TiptapEditor
                      key={`edit-${i}`}
                      initialValue={editHtml}
                      onChange={setEditHtml}
                    />
                    <div className="flex gap-1.5 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setEditingIndex(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={handleSaveEdit}>
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleStartEdit(i)}
                      title="Click to edit"
                    >
                      <p className="text-xs truncate hover:text-primary transition-colors">
                        {stripHtml(msg.text) || msg.text}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleRemoveMessage(i)}
                      disabled={saveMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add message */}
      <div className="pt-1 border-t border-border space-y-1.5">
        <Label className="text-xs tracking-wider uppercase text-muted-foreground">Add Message</Label>
        <TiptapEditor
          key={addKey}
          initialValue=""
          onChange={setNewHtml}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={handleAddMessage}
            disabled={!cleanHtml(newHtml) || saveMutation.isPending}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Social & Contact Links Manager ────────────────────────────────────────────

interface SocialLinksManagerProps {
  config: SiteConfig | null;
  isLoading: boolean;
}

const SocialLinksManager = ({ config, isLoading }: SocialLinksManagerProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const configIdRef = useRef<string | null>(config?._id ?? null);

  const initSocial = (config?.fields?.social as Record<string, string>) ?? brandConfig.social;
  const initContact = (config?.fields?.contact as Record<string, string>) ?? {};

  const [social, setSocial] = useState<Record<string, string>>(initSocial);
  const [contact, setContact] = useState<Record<string, string>>(initContact);

  useEffect(() => {
    if (!config?._id || config._id === configIdRef.current) return;
    configIdRef.current = config._id;
    setSocial((config.fields.social as Record<string, string>) ?? brandConfig.social);
    setContact((config.fields.contact as Record<string, string>) ?? {});
  }, [config?._id]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const fields = { social, contact };
      const id = configIdRef.current;
      if (id) return adminApi.updateConfig(id, { type: 'social_links', fields });
      return adminApi.createConfig({ type: 'social_links', fields });
    },
    onSuccess: (res) => {
      configIdRef.current = res.data._id;
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      toast({ title: 'Saved' });
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.errors?.msg || err?.message || 'Unknown error';
      toast({ title: 'Save failed', description: String(detail), variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-background rounded-sm border border-border p-5 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-background rounded-sm border border-border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase">Social &amp; Contact Links</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Used on the website footer and in transactional emails.
          </p>
        </div>
        <Button size="sm" className="h-8" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOCIAL_LINK_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <Input
              value={social[key] ?? ''}
              onChange={(e) => setSocial(s => ({ ...s, [key]: e.target.value }))}
              placeholder="https://..."
              className="h-9 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Contact Phone</Label>
          <Input
            value={contact.phone ?? ''}
            onChange={(e) => setContact(c => ({ ...c, phone: e.target.value }))}
            placeholder="+442074040146"
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Contact Email</Label>
          <Input
            value={contact.email ?? ''}
            onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))}
            placeholder="info@henigdiamonds.co.uk"
            className="h-9 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

// ── Jewellery Filter Config Panel ─────────────────────────────────────────────

interface FilterConfigPanelProps {
  config: SiteConfig | null;
  title: string;
  queryKey: string;
  getStatus: () => Promise<{ data: FilterConfigStatus }>;
  rebuild: () => Promise<{ data: FilterConfigRebuildResult }>;
}

const ARRAY_FILTER_KEYS = ['metals', 'shapes', 'stockTypes', 'ringSizes', 'certificates', 'caratValues'] as const;

const FilterConfigPanel = ({ config, title, queryKey, getStatus, rebuild }: FilterConfigPanelProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', queryKey],
    queryFn: () => getStatus().then(r => r.data),
  });

  const rebuildMutation = useMutation({
    mutationFn: () => rebuild().then(r => r.data),
    onSuccess: (result) => {
      refetch();
      toast({ title: 'Filter config rebuilt', description: result.message });
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.message || err?.message || 'Unknown error';
      toast({ title: 'Rebuild failed', description: String(detail), variant: 'destructive' });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const fields = JSON.parse(jsonText);
      return adminApi.updateConfig(config!._id, { type: config!.type, fields });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      setEditOpen(false);
      toast({ title: 'Config saved' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to save config.', variant: 'destructive' }),
  });

  const openEdit = () => {
    setJsonText(JSON.stringify(config?.fields ?? {}, null, 2));
    setJsonError('');
    setShowJson(false);
    setEditOpen(true);
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    try {
      JSON.parse(value);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON — fix before saving.');
    }
  };

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const fields = config?.fields ?? {};
  const subcategories = fields.subcategories as Record<string, string[]> | undefined;

  if (isLoading) {
    return (
      <div className="bg-background rounded-sm border border-border p-5 space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-background rounded-sm border border-border p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium tracking-widest uppercase">{title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rebuilt automatically every hour from Zoho product data.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {config && (
              <Button size="sm" variant="ghost" className="h-8" onClick={openEdit}>
                Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => rebuildMutation.mutate()}
              disabled={rebuildMutation.isPending}
            >
              {rebuildMutation.isPending
                ? <LoadingSpinner size={14} className="mr-1.5" />
                : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
              {rebuildMutation.isPending ? 'Rebuilding…' : 'Rebuild Now'}
            </Button>
          </div>
        </div>

        {/* Status */}
        {!data?.exists ? (
          <p className="text-xs text-muted-foreground py-3 text-center border border-dashed border-border rounded-sm">
            No config document found. Click Rebuild Now to create it.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.summary ?? {}).map(([key, count]) => (
                <div key={key} className="flex items-center gap-1.5 bg-muted/40 rounded-sm px-2.5 py-1">
                  <span className="text-xs text-muted-foreground">
                    {FILTER_KEY_LABELS[key] ?? key}
                  </span>
                  <span className="text-xs font-medium tabular-nums">{count}</span>
                </div>
              ))}
            </div>
            {data.updatedAt && (
              <p className="text-xs text-muted-foreground">
                Last updated: {formatDateTime(data.updatedAt)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* View / Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={open => !open && setEditOpen(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-light tracking-widest uppercase">
              {title}
            </DialogTitle>
          </DialogHeader>

          {showJson ? (
            <div className="space-y-3">
              <Textarea
                value={jsonText}
                onChange={e => handleJsonChange(e.target.value)}
                rows={18}
                className="font-mono text-xs"
                spellCheck={false}
              />
              {jsonError && (
                <p className="text-xs text-destructive">{jsonError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
              {/* Subcategories */}
              {subcategories && Object.keys(subcategories).length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                    Subcategories
                  </p>
                  <div className="divide-y divide-border rounded-sm border border-border overflow-hidden">
                    {Object.entries(subcategories).map(([category, subs]) => (
                      <div key={category} className="grid grid-cols-[140px_1fr] gap-3 px-3 py-2.5 bg-background">
                        <span className="text-xs font-medium self-start pt-0.5">{category}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(subs as string[]).map(sub => (
                            <span
                              key={sub}
                              className="inline-flex items-center rounded-sm bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simple array fields */}
              {ARRAY_FILTER_KEYS.map(key => {
                const values = fields[key] as string[] | undefined;
                if (!values?.length) return null;
                return (
                  <div key={key} className="space-y-2">
                    <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      {FILTER_KEY_LABELS[key] ?? key}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {values.map(v => (
                        <span
                          key={v}
                          className="inline-flex items-center rounded-sm bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter className="flex-row items-center justify-between sm:justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => setShowJson(v => !v)}
            >
              {showJson ? 'Structured View' : 'Edit as JSON'}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                {showJson ? 'Cancel' : 'Close'}
              </Button>
              {showJson && (
                <Button
                  onClick={() => saveMutation.mutate()}
                  disabled={!!jsonError || saveMutation.isPending}
                >
                  {saveMutation.isPending ? 'Saving…' : 'Save Config'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ── Main Settings Page ────────────────────────────────────────────────────────

const Settings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editConfig, setEditConfig] = useState<SiteConfig | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['admin', 'configs'],
    queryFn: () => adminApi.getConfigs().then(r => r.data),
  });

  // Separate announcement_bar, social_links and filter configs from the generic list
  const annConfig = configs.find(c => c.type === 'announcement_bar') ?? null;
  const socialLinksConfig = configs.find(c => c.type === 'social_links') ?? null;
  const filterConfig = configs.find(c => c.type === 'jewellery_filter_config') ?? null;
  const diamondsFilterConfig = configs.find(c => c.type === 'diamonds_filter_config') ?? null;
  const FILTER_CONFIG_TYPES = ['announcement_bar', 'social_links', 'jewellery_filter_config', 'diamonds_filter_config'];
  const otherConfigs = configs.filter(c => !FILTER_CONFIG_TYPES.includes(c.type));

  const openEdit = (config: SiteConfig) => {
    setEditConfig(config);
    setJsonText(JSON.stringify(config.fields, null, 2));
    setJsonError('');
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    try {
      JSON.parse(value);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON — fix before saving.');
    }
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const fields = JSON.parse(jsonText);
      // Pass type — backend validator requires it in the PATCH body
      return adminApi.updateConfig(editConfig!._id, { type: editConfig!.type, fields });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configs'] });
      setEditConfig(null);
      toast({ title: 'Config saved' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to save config.', variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {configs.length} configuration{configs.length !== 1 ? 's' : ''} loaded.
        </p>
      </div>

      {/* Announcement Bar — dedicated UI */}
      <AnnouncementManager config={annConfig} isLoading={isLoading} />

      {/* Social & Contact Links — dedicated UI */}
      <SocialLinksManager config={socialLinksConfig} isLoading={isLoading} />

      {/* Jewellery Filter Config */}
      <FilterConfigPanel
        config={filterConfig}
        title="Jewellery Filter Config"
        queryKey="filter-config-status"
        getStatus={adminApi.getFilterConfigStatus}
        rebuild={adminApi.rebuildFilterConfig}
      />

      {/* Diamonds Filter Config */}
      <FilterConfigPanel
        config={diamondsFilterConfig}
        title="Diamonds Filter Config"
        queryKey="diamonds-filter-config-status"
        getStatus={adminApi.getDiamondsFilterConfigStatus}
        rebuild={adminApi.rebuildDiamondsFilterConfig}
      />

      {/* Generic configs */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : otherConfigs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Settings2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No other configurations found.</p>
        </div>
      ) : (
        <div className="bg-background rounded-sm border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 border-b border-border bg-muted/50">
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Type</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground hidden sm:block">Updated</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Edit</span>
          </div>

          {otherConfigs.map(config => (
            <div
              key={config._id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate font-mono">{config.type}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {Object.keys(config.fields).length} field{Object.keys(config.fields).length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {config.updatedAt ? formatDate(config.updatedAt) : '—'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEdit(config)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editConfig} onOpenChange={open => !open && setEditConfig(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-light tracking-widest uppercase">
              {editConfig?.type}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label className="text-xs tracking-wider uppercase text-muted-foreground">
              Fields (JSON)
            </Label>
            <Textarea
              value={jsonText}
              onChange={e => handleJsonChange(e.target.value)}
              rows={18}
              className="font-mono text-xs"
              spellCheck={false}
            />
            {jsonError && (
              <p className="text-xs text-destructive">{jsonError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditConfig(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!!jsonError || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Config'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
