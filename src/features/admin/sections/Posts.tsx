import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, FileText, Pencil, Trash2, X, ImagePlus } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

// Bundled TinyMCE — no CDN, no API key required
import 'tinymce/tinymce';
import 'tinymce/models/dom';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/image';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/table';
import 'tinymce/plugins/media';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/quickbars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { adminApi, Post } from '@/api/admin';

type PostStatus = 'draft' | 'published';

const STATUS_CONFIG: Record<PostStatus, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  published: { label: 'Published', variant: 'default' },
  draft:     { label: 'Draft',     variant: 'outline' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const toDateTimeLocal = (iso: string) => {
  try { return new Date(iso).toISOString().slice(0, 16); }
  catch { return new Date().toISOString().slice(0, 16); }
};

const uid = () => Math.random().toString(36).slice(2, 9);

type ImageEntry = {
  id: string;
  file: File | null;
  preview: string;
  serverUrl: string;
};

type ButtonEntry = {
  id: string;
  label: string;
  url: string;
};

type PostForm = {
  title: string;
  date: string;
  snippet: string;
  content: string;
  status: PostStatus;
  related: string;
};

const EMPTY_FORM: PostForm = {
  title: '',
  date: new Date().toISOString().slice(0, 16),
  snippet: '',
  content: '',
  status: 'draft',
  related: '',
};

const postToImages = (post: Post): ImageEntry[] => {
  if (post.images?.length) {
    return post.images.map(url => ({ id: uid(), file: null, preview: url, serverUrl: url }));
  }
  if (post.src) {
    return [{ id: uid(), file: null, preview: post.src, serverUrl: post.src }];
  }
  return [];
};

const postToButtons = (post: Post): ButtonEntry[] =>
  (post.buttons || []).map(b => ({ ...b, id: uid() }));

const Posts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [view, setView] = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all');
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [buttons, setButtons] = useState<ButtonEntry[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: () => adminApi.getPosts().then(r => r.data),
  });

  const filtered = posts.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.snippet.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openCreate = () => {
    setEditPost(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setButtons([]);
    setView('form');
  };

  const openEdit = (post: Post) => {
    setEditPost(post);
    setForm({
      title:   post.title,
      date:    toDateTimeLocal(post.date),
      snippet: post.snippet,
      content: post.content,
      status:  post.status,
      related: (post.related || []).join(', '),
    });
    setImages(postToImages(post));
    setButtons(postToButtons(post));
    setView('form');
  };

  const handleBack = () => {
    setView('list');
    setImages([]);
    setButtons([]);
  };

  const handleReset = () => {
    if (editPost) {
      setForm({
        title:   editPost.title,
        date:    toDateTimeLocal(editPost.date),
        snippet: editPost.snippet,
        content: editPost.content,
        status:  editPost.status,
        related: (editPost.related || []).join(', '),
      });
      setImages(postToImages(editPost));
      setButtons(postToButtons(editPost));
    } else {
      setForm(EMPTY_FORM);
      setImages([]);
      setButtons([]);
    }
  };

  const handleFormField = (name: keyof PostForm, value: string) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const addImageFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    setImages(prev => [
      ...prev,
      ...valid.map(file => ({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        serverUrl: '',
      })),
    ]);
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) addImageFiles(e.dataTransfer.files);
  }, [addImageFiles]);

  const updateButton = (id: string, field: 'label' | 'url', value: string) =>
    setButtons(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));

  const removeButton = (id: string) =>
    setButtons(prev => prev.filter(b => b.id !== id));

  const addButton = () =>
    setButtons(prev => [...prev, { id: uid(), label: '', url: '' }]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('title',   form.title);
    fd.append('date',    new Date(form.date).toISOString());
    fd.append('snippet', form.snippet);
    fd.append('content', form.content);
    fd.append('status',  form.status);
    if (form.related) fd.append('related', form.related);

    const existingUrls: string[] = [];
    images.forEach((img, i) => {
      if (img.file) {
        if (i === 0) fd.append('src', img.file);
        fd.append('images', img.file);
      } else if (img.serverUrl) {
        if (i === 0) fd.append('src', img.serverUrl);
        existingUrls.push(img.serverUrl);
      }
    });
    fd.append('existingImages', JSON.stringify(existingUrls));
    fd.append('buttons', JSON.stringify(buttons.map(({ label, url }) => ({ label, url }))));
    return fd;
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const fd = buildFormData();
      return editPost
        ? adminApi.updatePost(editPost._id, fd)
        : adminApi.createPost(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      setView('list');
      toast({ title: editPost ? 'Post updated' : 'Post created' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to save post.', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      setDeleteTarget(null);
      toast({ title: 'Post deleted' });
    },
    onError: () =>
      toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' }),
  });

  const isFormValid = form.title.trim() && form.content.trim() && form.date;

  // ── Form View ──────────────────────────────────────────────────────────────
  if (view === 'form') {
    return (
      <div className="max-w-5xl space-y-5">
        <h2 className="text-base font-medium tracking-wide">News Post</h2>

        {/* Title */}
        <Input
          value={form.title}
          onChange={e => handleFormField('title', e.target.value)}
          placeholder="Title"
          className="rounded-none h-12 border-border focus-visible:ring-0 focus-visible:border-foreground"
        />

        {/* Snippet */}
        <Input
          value={form.snippet}
          onChange={e => handleFormField('snippet', e.target.value)}
          placeholder="Snippet"
          className="rounded-none h-12 border-border focus-visible:ring-0 focus-visible:border-foreground"
        />

        {/* Editor */}
        <div className="border border-border">
          <Editor
            value={form.content}
            onEditorChange={content => handleFormField('content', content)}
            init={{
              licenseKey: 'gpl',
              model: 'dom',
              skin: false,
              content_css: false,
              height: 520,
              menubar: true,
              statusbar: true,
              resize: false,
              plugins: [
                'link', 'lists', 'image', 'wordcount',
                'table', 'media', 'fullscreen', 'preview',
                'searchreplace', 'charmap', 'anchor', 'codesample',
                'insertdatetime', 'visualblocks', 'quickbars',
              ],
              toolbar: [
                'undo redo | blocks fontsize | bold italic underline strikethrough | forecolor backcolor | removeformat',
                'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link anchor | image media table | charmap | insertbutton | fullscreen preview',
              ],
              toolbar_mode: 'wrap',
              quickbars_selection_toolbar: 'bold italic | link h2 h3 blockquote',
              quickbars_insert_toolbar: 'image media table',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setup: (editor: any) => {
                editor.ui.registry.addButton('insertbutton', {
                  text: 'Button',
                  tooltip: 'Insert a styled CTA button',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onAction: () => {
                    editor.windowManager.open({
                      title: 'Insert Button',
                      body: {
                        type: 'panel',
                        items: [
                          { type: 'input', name: 'label', label: 'Button Label', placeholder: 'Shop Now' },
                          { type: 'input', name: 'url',   label: 'URL',          placeholder: 'https://' },
                        ],
                      },
                      buttons: [
                        { type: 'cancel', text: 'Cancel' },
                        { type: 'submit', text: 'Insert', buttonType: 'primary' },
                      ],
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onSubmit: (api: any) => {
                        const { label, url } = api.getData();
                        if (label && url) {
                          editor.insertContent(
                            `<a href="${url}" style="display:inline-block;padding:10px 24px;background-color:#173731;color:#f5f5ea;text-decoration:none;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:inherit;" target="_blank">${label}</a>`
                          );
                        }
                        api.close();
                      },
                    });
                  },
                });
              },
              image_title: true,
              automatic_uploads: true,
              file_picker_types: 'image',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              file_picker_callback: (callback: any) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('src', file);
                  try {
                    const res = await adminApi.uploadPostImage(fd);
                    callback(res.data.url, { title: file.name });
                  } catch (err: any) {
                    const msg = err?.response?.data?.errors?.msg || err?.message || 'Upload failed';
                    toast({ title: 'Image upload failed', description: msg, variant: 'destructive' });
                  }
                };
                input.click();
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              images_upload_handler: async (blobInfo: any) => {
                const fd = new FormData();
                fd.append('src', blobInfo.blob(), blobInfo.filename());
                try {
                  const res = await adminApi.uploadPostImage(fd);
                  return res.data.url;
                } catch (err: any) {
                  const msg = err?.response?.data?.errors?.msg || err?.message || 'Upload failed';
                  toast({ title: 'Image upload failed', description: msg, variant: 'destructive' });
                  throw err;
                }
              },
              content_style: 'body { font-family: inherit; font-size: 12pt; margin: 8px; line-height: 1.6; color: #173731; }',
            }}
          />
        </div>

        {/* Images */}
        <div>
          <h3 className="text-sm font-medium tracking-wide mb-2">Images</h3>
          <div
            className={`flex flex-wrap gap-3 border border-border p-3 min-h-[96px] transition-colors ${
              isDragOver ? 'bg-muted/40' : ''
            }`}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleImageDrop}
          >
            {images.map((img, index) => (
              <div key={img.id} className="relative w-24 h-24 border border-border group shrink-0">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/60 text-white tracking-wider py-0.5 uppercase">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add image slot */}
            <div
              className="w-24 h-24 border border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/20 transition-colors shrink-0"
              onClick={() => imageInputRef.current?.click()}
            >
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => {
                  if (e.target.files?.length) addImageFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground tracking-widest uppercase">Add</span>
            </div>
          </div>
          {images.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Drag images above or click Add. First image becomes the cover.
            </p>
          )}
        </div>

        {/* Button Links */}
        <div>
          <h3 className="text-sm font-medium tracking-wide mb-2">Button Links</h3>
          <div className="border border-border divide-y divide-border">
            {buttons.length === 0 && (
              <p className="text-xs text-muted-foreground px-4 py-3">No buttons added yet.</p>
            )}
            {buttons.map(btn => (
              <div key={btn.id} className="flex items-center">
                <Input
                  value={btn.label}
                  onChange={e => updateButton(btn.id, 'label', e.target.value)}
                  placeholder="Button label"
                  className="rounded-none border-0 border-r border-border h-10 w-40 shrink-0 focus-visible:ring-0 focus-visible:border-foreground"
                />
                <Input
                  value={btn.url}
                  onChange={e => updateButton(btn.id, 'url', e.target.value)}
                  placeholder="https://…"
                  className="rounded-none border-0 flex-1 h-10 focus-visible:ring-0 focus-visible:border-foreground"
                />
                <button
                  type="button"
                  onClick={() => removeButton(btn.id)}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive flex-shrink-0 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div
              className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-muted/20 transition-colors text-muted-foreground text-xs tracking-widest uppercase select-none"
              onClick={addButton}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Button
            </div>
          </div>
        </div>

        {/* Options */}
        <div>
          <h3 className="text-sm font-medium tracking-wide mb-2">Options</h3>
          <div className="border border-border divide-y divide-border">
            {/* Post Date */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-muted-foreground">Post Date</span>
              <input
                type="datetime-local"
                value={form.date}
                onChange={e => handleFormField('date', e.target.value)}
                className="border border-border px-3 py-1.5 text-sm bg-background focus:outline-none focus:border-foreground"
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select value={form.status} onValueChange={v => handleFormField('status', v as PostStatus)}>
                <SelectTrigger className="w-36 rounded-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Related News */}
            <div className="px-4 py-3 space-y-2">
              <span className="text-sm text-muted-foreground block">Related News</span>
              <Textarea
                value={form.related}
                onChange={e => handleFormField('related', e.target.value)}
                placeholder="Comma-separated post IDs…"
                rows={3}
                className="rounded-none resize-none focus-visible:ring-0 focus-visible:border-foreground"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" className="tracking-widest uppercase text-xs" onClick={handleBack}>
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="tracking-widest uppercase text-xs rounded-none"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="tracking-widest uppercase text-xs rounded-none"
              onClick={() => saveMutation.mutate()}
              disabled={!isFormValid || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save / Upload'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── List View ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light tracking-widest uppercase">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {posts.length} post{posts.length !== 1 ? 's' : ''} total.
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search posts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Post List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No posts found.</p>
        </div>
      ) : (
        <div className="bg-background rounded-sm border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-border bg-muted/50">
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Title</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground hidden sm:block">Date</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Status</span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Actions</span>
          </div>

          {filtered.map(post => {
            const sc = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.draft;
            return (
              <div
                key={post._id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{post.snippet}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(post.date)}</p>
                </div>
                <Badge variant={sc.variant} className="text-xs whitespace-nowrap">{sc.label}</Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(post)}
                    aria-label="Edit post"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(post)}
                    aria-label="Delete post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Posts;
