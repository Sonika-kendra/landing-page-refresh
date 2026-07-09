import React, { useRef, useState, useCallback, useEffect, KeyboardEvent } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { ArrowLeft, Mail, ChevronDown, Check, X, Copy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AdminPageHeader from '../components/AdminPageHeader';
import { adminApi, EmailTemplateDoc } from '@/api/admin';
import { toast } from 'sonner';

const TEMPLATE_VARIABLES = [
  {
    group: 'User',
    vars: [
      { key: 'email',          desc: 'Email address' },
      { key: 'firstName',      desc: 'First name' },
      { key: 'lastName',       desc: 'Last name' },
      { key: 'userName',       desc: 'Display name (firstName)' },
      { key: 'title',          desc: 'Title (Mr, Mrs, …)' },
      { key: 'companyName',    desc: 'Company name' },
      { key: 'companyWebsite', desc: 'Company website' },
      { key: 'phone',          desc: 'Phone number' },
      { key: 'role',           desc: 'Account role' },
      { key: 'status',         desc: 'Account status' },
    ],
  },
  {
    group: 'Order',
    vars: [
      { key: 'orderNumber',   desc: 'Zoho CRM Quote / Order Form ID' },
      { key: 'orderDate',     desc: 'Date the order was placed (DD/MM/YYYY)' },
      { key: 'itemsList',     desc: 'Plain-text list of all line items' },
      { key: 'itemsTable', raw: true, desc: 'HTML table of line items (Category, Stock code, CT, YG/WG, Qty, Unit price, Total)' },
      { key: 'clientCode',    desc: 'Short customer reference code (e.g. CLA1B2C3)' },
      { key: 'totalQty',      desc: 'Sum of all line-item quantities' },
      { key: 'subtotal',      desc: 'Subtotal (e.g. £398.00)' },
      { key: 'vat',           desc: 'VAT amount (e.g. £79.60)' },
      { key: 'shipping',      desc: 'Shipping cost or "Free"' },
      { key: 'total',         desc: 'Order total (e.g. £477.60)' },
      { key: 'trackUrl',      desc: 'Link to order tracking page' },
      { key: 'adminOrderUrl', desc: 'Admin link to view the order (admin template)' },
    ],
  },
  {
    group: 'Context',
    vars: [
      { key: 'reason',       desc: 'Reason text (e.g. rejection reason)' },
      { key: 'verification', desc: 'Verification token / link' },
    ],
  },
];

const AdminEmailEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isFresh = (location.state as { fresh?: boolean } | null)?.fresh ?? false;
  const savedRef = useRef(false);
  const emailEditorRef = useRef<EditorRef>(null);
  const [saving, setSaving] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [editorLoadFailed, setEditorLoadFailed] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState('');
  const recipientInputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addRecipient = () => {
    const email = recipientInput.trim();
    if (!email) return;
    if (recipients.includes(email)) {
      toast.error('This email is already added');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setRecipients((prev) => [...prev, email]);
    setRecipientInput('');
    recipientInputRef.current?.focus();
  };

  const removeRecipient = (email: string) => {
    setRecipients((prev) => prev.filter((r) => r !== email));
  };

  const handleRecipientKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient();
    }
  };

  const { data: allTemplates = [] } = useQuery<EmailTemplateDoc[]>({
    queryKey: ['admin', 'email-templates'],
    queryFn: () => adminApi.getAllEmailTemplates().then((r) => r.data),
  });

  const handleCancel = useCallback(async () => {
    if (isFresh && !savedRef.current && id) {
      try { await adminApi.deleteEmailTemplate(id); } catch { /* ignore */ }
    }
    navigate('/admin/email');
  }, [isFresh, id, navigate]);

  useEffect(() => {
    if (editorReady) return;
    const timer = setTimeout(() => setEditorLoadFailed(true), 25_000);
    return () => clearTimeout(timer);
  }, [editorReady]);

  const onReady = useCallback(async () => {
    setEditorLoadFailed(false);
    if (!id) {
      setEditorReady(true);
      return;
    }
    try {
      const res = await adminApi.getEmailTemplateById(id);
      setName(res.data.name || 'New Template');
      setSubject(res.data.subject || '');
      setRecipients(res.data.recipients ?? []);
      if (emailEditorRef.current?.editor) {
        if (res.data.design) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          emailEditorRef.current.editor.loadDesign(res.data.design as any);
        } else if (res.data.html) {
          // No design saved yet — wrap the raw HTML in a single HTML block so it's visible
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (emailEditorRef.current.editor as any).loadDesign({
            body: {
              rows: [{
                cells: [1],
                columns: [{
                  contents: [{ type: 'html', values: { html: res.data.html } }],
                  values: {},
                }],
                values: {},
              }],
              values: { backgroundColor: '#f0f1f5' },
            },
          });
        }
      }
    } catch {
      toast.error('Failed to load template');
    } finally {
      setEditorReady(true);
    }
  }, [id]);

  const copyVariable = (key: string, raw?: boolean) => {
    const tag = raw ? `{{{${key}}}}` : `{{${key}}}`;
    navigator.clipboard.writeText(tag).catch(() => {});
    toast.success(`Copied ${tag}`);
  };

  const saveDesign = () => {
    if (!id || !emailEditorRef.current?.editor) return;
    setSaving(true);
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { design, html } = data;
      try {
        await adminApi.saveEmailTemplate(id, design, html, name, subject, recipients);
        savedRef.current = true;
        toast.success('Template saved');
      } catch {
        toast.error('Failed to save template');
      } finally {
        setSaving(false);
      }
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Email Editor"
        description="Edit the template design and name, then save."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All Templates
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Switch Template
                  <ChevronDown className="h-4 w-4 ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-72 overflow-y-auto">
                {allTemplates.length === 0 ? (
                  <DropdownMenuItem disabled>No templates found</DropdownMenuItem>
                ) : (
                  allTemplates.map((t) => (
                    <DropdownMenuItem
                      key={t._id}
                      onClick={() => {
                        if (t._id !== id) {
                          setName('');
                          setSubject('');
                          setRecipients([]);
                          navigate(`/admin/email/${t._id}`);
                        }
                      }}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">{t.name || 'Untitled'}</span>
                      {t._id === id && <Check className="h-3.5 w-3.5 shrink-0 ml-2 text-primary" />}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Template Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Welcome Email"
            className="h-9 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Email Subject</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Welcome to Henig Diamonds"
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Recipients */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Recipients</label>
          <div className="flex gap-2">
            <Input
              ref={recipientInputRef}
              type="email"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              onKeyDown={handleRecipientKeyDown}
              placeholder="e.g. john@example.com"
              className="h-9 text-sm"
            />
            <Button type="button" variant="outline" size="sm" onClick={addRecipient} className="shrink-0 h-9 px-4">
              Add
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="shrink-0 h-9 px-2 gap-1 text-xs">
                  <Info className="h-3 w-3" />
                  Hints
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-[420px] p-0 text-xs">
                <div className="px-3 py-2 border-b border-border flex items-center gap-1.5">
                  <Info className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-foreground tracking-wide uppercase text-[11px]">Template Variable Hints</span>
                </div>
                <div className="px-3 py-2.5 space-y-3">
                  <ul className="space-y-1">
                    {([
                      <span>Use <span className="font-mono bg-muted border border-border rounded px-1 py-0.5 text-[10px]">{`{{variable}}`}</span> to insert dynamic values into the <strong>body</strong>.</span>,
                      <span>Variables in the <strong>Subject</strong> line are <strong>not</strong> substituted — body only.</span>,
                      <span>Click the copy icon on any row, then paste into the template.</span>,
                    ] as React.ReactNode[]).map((text, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/60 shrink-0" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                  {TEMPLATE_VARIABLES.map(({ group, vars }) => (
                    <div key={group}>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{group} Fields</p>
                      <div className="rounded-sm border border-border overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="text-left px-2 py-1 font-medium text-muted-foreground text-[10px] w-36">Variable</th>
                              <th className="text-left px-2 py-1 font-medium text-muted-foreground text-[10px]">Description</th>
                              <th className="w-7" />
                            </tr>
                          </thead>
                          <tbody>
                            {vars.map(({ key, desc, raw }, idx) => {
                              const tag = raw ? `{{{${key}}}}` : `{{${key}}}`;
                              return (
                              <tr key={key} className={`${idx !== vars.length - 1 ? 'border-b border-border' : ''} hover:bg-primary/5 transition-colors`}>
                                <td className="px-2 py-1.5">
                                  <span className="font-mono text-[10px] bg-background border border-border rounded px-1 py-0.5">{tag}</span>
                                </td>
                                <td className="px-2 py-1.5 text-muted-foreground text-[11px]">{desc}</td>
                                <td className="px-1.5 py-1.5 text-right">
                                  <button type="button" onClick={() => copyVariable(key, raw)} title={`Copy ${tag}`} className="text-muted-foreground hover:text-primary transition-colors">
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {recipients.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipients.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    className="hover:opacity-70 transition-opacity ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="relative">
        {!editorReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/40 border border-border rounded-sm" style={{ height: '80vh' }}>
            {editorLoadFailed ? (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <p className="text-sm text-muted-foreground">Editor failed to load. The Unlayer CDN may be unavailable.</p>
                <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading editor…</p>
            )}
          </div>
        )}
      <EmailEditor
        key={id}
        ref={emailEditorRef}
        onReady={onReady}
        options={{
          displayMode: 'email',
          features: {
            // Core UI
            preview: true,
            undoRedo: true,
            devTab: true,
            audit: true,
            blocks: true,
            // Email-specific
            preheaderText: true,
            headersAndFooters: true,
            // Images
            imageEditor: true,
            svgImageUpload: true,
            userUploads: true,
            // Text editing
            textEditor: {
              spellChecker: true,
              cleanPaste: true,
              emojis: true,
              tables: true,
            },
            // Misc
            colorPicker: {},
            pageAnchors: true,
            smartMergeTags: true,
          },
          tools: {
            button:    { enabled: true },
            divider:   { enabled: true },
            heading:   { enabled: true },
            html:      { enabled: true },
            image:     { enabled: true },
            menu:      { enabled: true },
            paragraph: { enabled: true },
            social:    { enabled: true },
            text:      { enabled: true },
          },
          appearance: {
            theme: 'modern_light',
          },
          fonts: {
            showDefaultFonts: true,
          },
        }}
        style={{ height: '80vh', borderRadius: '4px', overflow: 'hidden' }}
      />
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 pb-6">
        <Button variant="outline" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={saveDesign} disabled={saving}>
          <Mail className="h-4 w-4 mr-1.5" />
          {saving ? 'Saving…' : 'Save Template'}
        </Button>
      </div>
    </div>
  );
};

export default AdminEmailEditor;
