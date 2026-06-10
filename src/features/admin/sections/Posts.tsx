import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, FileText, Pencil, Trash2, X, ImagePlus, MoreVertical, Eye, ArrowLeft, Calendar } from 'lucide-react';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  return `${newApiURL}${src}`;
};

const fixContentImageUrls = (html: string) =>
  html.replace(/(["'])\/posts\/image\//g, `$1${newApiURL}/posts/image/`);

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
  const [coverHeight, setCoverHeight] = useState(256);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const draftIdRef = useRef<string>(uid());
  const emailEditorRef = useRef<EditorRef>(null);
  const designRef = useRef<object | null>(null);
  const resizingRef = useRef(false);
  const resizeStartY = useRef(0);
  const resizeStartH = useRef(0);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    resizeStartY.current = e.clientY;
    resizeStartH.current = coverHeight;
    const onMove = (me: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = me.clientY - resizeStartY.current;
      setCoverHeight(Math.max(120, resizeStartH.current + delta));
    };
    const onUp = () => {
      resizingRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

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
    draftIdRef.current = uid();
    designRef.current = null;
    setForm(EMPTY_FORM);
    setImages([]);
    setButtons([]);
    setView('form');
  };

  const openEdit = (post: Post) => {
    setEditPost(post);
    designRef.current = (post.design as object) || null;
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
      designRef.current = (editPost.design as object) || null;
      if (emailEditorRef.current?.editor) {
        if (editPost.design) {
          emailEditorRef.current.editor.loadDesign(editPost.design as object);
        }
      }
    } else {
      setForm(EMPTY_FORM);
      setImages([]);
      setButtons([]);
      designRef.current = null;
    }
  };

  const handleFormField = (name: keyof PostForm, value: string) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const addImageFiles = useCallback((files: FileList | File[]) => {
    const first = Array.from(files).find(f => f.type.startsWith('image/'));
    if (!first) return;
    setImages([{ id: uid(), file: first, preview: URL.createObjectURL(first), serverUrl: '' }]);
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

  // Called by Unlayer once the editor iframe is ready; loads the existing design if editing
  const onEditorLoad = useCallback(() => {
    if (designRef.current && emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.loadDesign(designRef.current);
    }
  }, []);

  // Build FormData from current form state + exported HTML/design
  const buildFd = (html: string, design: object, statusOverride?: PostStatus) => {
    const fd = new FormData();
    fd.append('title',   form.title);
    fd.append('date',    new Date(form.date).toISOString());
    fd.append('snippet', form.snippet);
    fd.append('content', html || ' ');
    fd.append('status',  statusOverride ?? form.status);
    if (form.related) fd.append('related', form.related);
    fd.append('design', JSON.stringify(design));

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
    if (!editPost) fd.append('draftId', draftIdRef.current);
    return fd;
  };

  const saveMutation = useMutation({
    mutationFn: ({ fd }: { fd: FormData; statusOverride?: PostStatus }) =>
      editPost ? adminApi.updatePost(editPost._id, fd) : adminApi.createPost(fd),
    onSuccess: (_, { statusOverride }) => {
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

  // Save from the form view — exports HTML+design from the live Unlayer editor
  const handleSaveFromEditor = (statusOverride?: PostStatus) => {
    if (!emailEditorRef.current?.editor) return;
    emailEditorRef.current.editor.exportHtml((data) => {
      designRef.current = data.design;
      const fd = buildFd(data.html, data.design, statusOverride);
      saveMutation.mutate({ fd, statusOverride });
    });
  };

  // Save from the preview view — editor is unmounted; use captured content in form.content
  const handleSaveFromPreview = (statusOverride?: PostStatus) => {
    const fd = buildFd(form.content, designRef.current ?? {}, statusOverride);
    saveMutation.mutate({ fd, statusOverride });
  };

  // Switch to preview: export HTML+design first so preview renders correctly
  const handlePreview = () => {
    if (!emailEditorRef.current?.editor) return;
    emailEditorRef.current.editor.exportHtml((data) => {
      designRef.current = data.design;
      setForm(prev => ({ ...prev, content: data.html }));
      setView('preview');
    });
  };

  const isFormValid = form.title.trim() && form.date;

  // ── Preview View ───────────────────────────────────────────────────────────
  if (view === 'preview') {
    const previewImage = images[0] ? images[0].preview : null;

    return (
      <div className="w-full">
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
                onClick={() => handleSaveFromPreview('published')}
                disabled={!isFormValid || saveMutation.isPending}
              >
                {saveMutation.isPending ? 'Publishing…' : 'Publish'}
              </Button>
            )}
          </div>
        </div>

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
              dangerouslySetInnerHTML={{ __html: fixContentImageUrls(form.content) }}
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
            onClick={handlePreview}
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
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              if (e.target.files?.length) addImageFiles(e.target.files);
              e.target.value = '';
            }}
          />
          {images.length > 0 ? (
            <div className="relative w-full border border-border group overflow-hidden" style={{ height: coverHeight }}>
              <img
                src={images[0].preview}
                alt=""
                className="w-full h-full object-cover"
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleImageDrop}
              />
              {isDragOver && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-xs tracking-widest uppercase">Drop to replace</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              <button
                type="button"
                onClick={() => setImages([])}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="absolute bottom-6 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 text-white text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Replace
              </button>
              {/* Resize handle */}
              <div
                className="absolute bottom-0 left-0 right-0 h-3 flex items-center justify-center cursor-ns-resize group/handle select-none"
                onMouseDown={handleResizeMouseDown}
              >
                <div className="w-10 h-1 rounded-full bg-white/40 group-hover/handle:bg-white/80 transition-colors" />
              </div>
            </div>
          ) : (
            <div
              className={`relative w-full border border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                isDragOver ? 'bg-muted/40' : 'hover:bg-muted/20'
              }`}
              style={{ height: coverHeight }}
              onClick={() => imageInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleImageDrop}
            >
              <ImagePlus className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground tracking-widest uppercase">Add Cover Image</span>
              <span className="text-[11px] text-muted-foreground/60">Drag & drop or click to upload</span>
              {/* Resize handle */}
              <div
                className="absolute bottom-0 left-0 right-0 h-3 flex items-center justify-center cursor-ns-resize group/handle select-none"
                onMouseDown={e => { e.stopPropagation(); handleResizeMouseDown(e); }}
              >
                <div className="w-10 h-1 rounded-full bg-border group-hover/handle:bg-muted-foreground/60 transition-colors" />
              </div>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="border border-border overflow-hidden">
          <EmailEditor
            ref={emailEditorRef}
            onLoad={onEditorLoad}
            options={{ displayMode: 'web' }}
            style={{ height: '70vh' }}
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
              onClick={() => handleSaveFromEditor('draft')}
              disabled={!isFormValid || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Draft'}
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
