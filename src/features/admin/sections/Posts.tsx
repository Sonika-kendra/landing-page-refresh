import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, FileText, Pencil, Trash2, X, ImagePlus, MoreVertical, Eye, ArrowLeft, Calendar } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminApi, Post } from '@/api/admin';
import { newApiURL } from '@/config/site';

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

const resolveImageUrl = (src: string) => {
  if (src.startsWith('http')) return src;
  // WorkDrive images are served via the proxy; use relative path
  if (src.startsWith('/posts/image/')) return src;
  return `${newApiURL}${src}`;
};

const postToImages = (post: Post): ImageEntry[] => {
  if (post.images?.length) {
    return post.images.map(url => ({ id: uid(), file: null, preview: resolveImageUrl(url), serverUrl: url }));
  }
  if (post.src) {
    return [{ id: uid(), file: null, preview: resolveImageUrl(post.src), serverUrl: post.src }];
  }
  return [];
};

const postToButtons = (post: Post): ButtonEntry[] =>
  (post.buttons || []).map(b => ({ ...b, id: uid() }));

const Posts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [view, setView] = useState<'list' | 'form' | 'preview'>('list');
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

  const buildFormData = (statusOverride?: PostStatus) => {
    const fd = new FormData();
    fd.append('title',   form.title);
    fd.append('date',    new Date(form.date).toISOString());
    fd.append('snippet', form.snippet);
    fd.append('content', form.content);
    fd.append('status',  statusOverride ?? form.status);
    if (form.related) fd.append('related', form.related);

    const existingUrls: string[] = [];
    images.forEach((img, i) => {
      if (img.file) {
        if (i === 0) fd.append('src', img.file);
        else fd.append('images', img.file);
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
    mutationFn: (statusOverride?: PostStatus) => {
      const fd = buildFormData(statusOverride);
      return editPost
        ? adminApi.updatePost(editPost._id, fd)
        : adminApi.createPost(fd);
    },
    onSuccess: (_, statusOverride) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      if (statusOverride) setForm(prev => ({ ...prev, status: statusOverride }));
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

  // ── Preview View ───────────────────────────────────────────────────────────
  if (view === 'preview') {
    const previewImage = images[0]
      ? images[0].preview
      : null;

    return (
      <div className="w-full">
        {/* Admin toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <button
            onClick={() => setView('form')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit
          </button>
          <div className="flex items-center gap-3">
            <Badge variant={STATUS_CONFIG[form.status].variant} className="text-[10px] px-2">
              {STATUS_CONFIG[form.status].label}
            </Badge>
            {form.status !== 'published' && (
              <Button
                className="tracking-widest uppercase text-xs rounded-none"
                onClick={() => saveMutation.mutate('published')}
                disabled={!isFormValid || saveMutation.isPending}
              >
                {saveMutation.isPending ? 'Publishing…' : 'Publish'}
              </Button>
            )}
          </div>
        </div>

        {/* Blog post preview — mirrors PostDetail layout */}
        <article className="section-ivory py-10 px-8">
          <h1 className="henig-heading-display text-3xl md:text-4xl mb-4 text-foreground">
            {form.title || <span className="text-muted-foreground italic">Untitled Post</span>}
          </h1>

          {form.date && (
            <div className="flex items-center gap-2 text-muted-foreground mb-8">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(form.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}

          {previewImage && (
            <div className="mb-10 overflow-hidden">
              <img
                src={previewImage}
                alt={form.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {form.snippet && (
            <p className="text-base text-foreground/70 italic mb-6 border-l-2 border-border pl-4">
              {form.snippet}
            </p>
          )}

          {form.content ? (
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: form.content }}
            />
          ) : (
            <p className="text-muted-foreground italic">No content yet.</p>
          )}
        </article>
      </div>
    );
  }

  // ── Form View ──────────────────────────────────────────────────────────────
  if (view === 'form') {
    return (
      <div className="w-full space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="tracking-widest uppercase text-xs gap-1.5 px-0 hover:bg-transparent" onClick={handleBack}>
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Button>
            <span className="text-muted-foreground/40">|</span>
            <h2 className="text-base font-medium tracking-wide">News Post</h2>
            <Badge variant={STATUS_CONFIG[form.status].variant} className="text-[10px] px-2">
              {STATUS_CONFIG[form.status].label}
            </Badge>
          </div>
          <Button
            variant="outline"
            className="tracking-widest uppercase text-xs rounded-none gap-1.5"
            onClick={() => setView('preview')}
            disabled={!isFormValid}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </Button>
        </div>

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

        {/* Cover Image */}
        <div>
          <h3 className="text-sm font-medium tracking-wide mb-2">Cover Image</h3>
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
                  if (editPost) fd.append('postId', editPost._id);
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
                if (editPost) fd.append('postId', editPost._id);
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

          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end pt-1">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="tracking-widest uppercase text-xs rounded-none"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              className="tracking-widest uppercase text-xs rounded-none"
              onClick={() => saveMutation.mutate('draft')}
              disabled={!isFormValid || saveMutation.isPending}
            >
              {saveMutation.isPending && saveMutation.variables === 'draft' ? 'Saving…' : 'Save Draft'}
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

      {/* Post Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(post => {
            const sc = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.draft;
            const coverSrc = post.src ? resolveImageUrl(post.src) : (post.images?.[0] ? resolveImageUrl(post.images[0]) : null);
            return (
              <div key={post._id} className="group relative aspect-[4/3] overflow-hidden bg-muted/40 border border-border cursor-pointer" onClick={() => openEdit(post)}>
                {/* Image */}
                {coverSrc
                  ? <img src={coverSrc} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  : <div className="absolute inset-0 flex items-center justify-center bg-muted/20"><FileText className="w-10 h-10 text-muted-foreground/30" /></div>
                }

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Status badge top-left */}
                <div className="absolute top-2 left-2">
                  <Badge variant={sc.variant} className="text-[10px] px-1.5 py-0">{sc.label}</Badge>
                </div>

                {/* Three-dot menu top-right */}
                <div className="absolute top-1 right-1" onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => openEdit(post)}>
                        <Pencil className="w-3.5 h-3.5 mr-2" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(post)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Title + date overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-[13px] font-medium leading-snug line-clamp-2">{post.title}</p>
                  <p className="text-white/60 text-[11px] mt-0.5">{formatDate(post.date)}</p>
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
