import { useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EmailEditor, { EditorRef } from 'react-email-editor';
import {
  ArrowLeft, Eye, ImagePlus, Loader2, X, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminApi } from '@/api/admin';
import { newApiURL } from '@/config/site';
import { toast } from 'sonner';

type PostStatus = 'draft' | 'published';

const STATUS_CONFIG: Record<PostStatus, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
  published: { label: 'Published', variant: 'default' },
  draft:     { label: 'Draft',     variant: 'outline' },
};

const uid = () => Math.random().toString(36).slice(2, 9);

type ImageEntry = { id: string; file: File | null; preview: string; serverUrl: string };

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

const resolveImageUrl = (src: string) =>
  src.startsWith('http') ? src : `${newApiURL}${src}`;

const fixContentImageUrls = (html: string) =>
  html.replace(/(["'])\/posts\/image\//g, `$1${newApiURL}/posts/image/`);

const toDateTimeLocal = (iso: string) => {
  try { return new Date(iso).toISOString().slice(0, 16); }
  catch { return new Date().toISOString().slice(0, 16); }
};

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const emailEditorRef = useRef<EditorRef>(null);
  const designRef = useRef<object | null>(null);
  const draftIdRef = useRef<string>(uid());
  const imageInputRef = useRef<HTMLInputElement>(null);
  const resizingRef = useRef(false);
  const resizeStartY = useRef(0);
  const resizeStartH = useRef(0);

  const [editorReady, setEditorReady] = useState(false);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [coverHeight, setCoverHeight] = useState(256);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [view, setView] = useState<'editor' | 'preview'>('editor');

  // ── Load existing post ────────────────────────────────────────────────────
  const { isLoading: isPostLoading } = useQuery({
    queryKey: ['admin', 'post', id],
    queryFn: () => adminApi.getPostById(id!).then(r => r.data),
    enabled: isEdit,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    select: (post) => {
      // Populate form once data arrives
      setForm({
        title:   post.title,
        date:    toDateTimeLocal(post.date),
        snippet: post.snippet,
        content: post.content,
        status:  post.status,
        related: (post.related || []).join(', '),
      });

      const imgs: ImageEntry[] = post.images?.length
        ? post.images.map(url => ({ id: uid(), file: null, preview: resolveImageUrl(url), serverUrl: url }))
        : post.src
          ? [{ id: uid(), file: null, preview: resolveImageUrl(post.src), serverUrl: post.src }]
          : [];
      setImages(imgs);

      designRef.current = (post.design as object) ?? null;

      // If editor already mounted, load the design now
      if (editorReady && post.design && emailEditorRef.current?.editor) {
        emailEditorRef.current.editor.loadDesign(post.design as any);
      }

      return post;
    },
  });

  // ── Image helpers ─────────────────────────────────────────────────────────
  const uploadToWorkDrive = useCallback(async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('src', file);
    fd.append('postId', id ?? draftIdRef.current);
    const result = await adminApi.uploadPostImage(fd);
    return resolveImageUrl(result.data.url);
  }, [id]);

  const addImageFiles = useCallback(async (files: FileList | File[]) => {
    const first = Array.from(files).find(f => f.type.startsWith('image/'));
    if (!first) return;
    const tempId = uid();
    const preview = URL.createObjectURL(first);
    setImages([{ id: tempId, file: first, preview, serverUrl: '' }]);
    setIsCoverUploading(true);
    try {
      const fd = new FormData();
      fd.append('src', first);
      if (id) fd.append('postId', id);
      const result = await adminApi.uploadPostImage(fd);
      setImages([{ id: tempId, file: null, preview, serverUrl: result.data.url }]);
    } catch {
      setImages([]);
      toast.error('Could not upload cover image to WorkDrive.');
    } finally {
      setIsCoverUploading(false);
    }
  }, [id]);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) addImageFiles(e.dataTransfer.files);
  }, [addImageFiles]);

  // ── Resize cover ──────────────────────────────────────────────────────────
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    resizeStartY.current = e.clientY;
    resizeStartH.current = coverHeight;
    const onMove = (me: MouseEvent) => {
      if (!resizingRef.current) return;
      setCoverHeight(Math.max(120, resizeStartH.current + me.clientY - resizeStartY.current));
    };
    const onUp = () => {
      resizingRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Unlayer callbacks ─────────────────────────────────────────────────────
  const onEditorReady = useCallback((editor: NonNullable<EditorRef['editor']>) => {
    editor.registerCallback('image', async (data, done) => {
      const file = data.accepted?.[0] ?? data.attachments?.[0];
      if (!file) { done({ url: '' }); return; }
      try { done({ url: await uploadToWorkDrive(file) }); }
      catch { toast.error('Image upload failed.'); done({ url: '' }); }
    });

    editor.registerCallback('selectImage', (_, done) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(input);
      const cleanup = () => { if (document.body.contains(input)) document.body.removeChild(input); };
      input.onchange = async () => {
        const file = input.files?.[0];
        cleanup();
        if (!file) { done({ url: '' }); return; }
        try { done({ url: await uploadToWorkDrive(file) }); }
        catch { toast.error('Image upload failed.'); done({ url: '' }); }
      };
      const onFocus = () => setTimeout(cleanup, 500);
      window.addEventListener('focus', onFocus, { once: true });
      input.addEventListener('change', () => window.removeEventListener('focus', onFocus));
      input.click();
    });

    if (designRef.current) editor.loadDesign(designRef.current as any);
    setEditorReady(true);
  }, [uploadToWorkDrive]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (fd: FormData) =>
      isEdit ? adminApi.updatePost(id!, fd) : adminApi.createPost(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ['admin', 'post', id] });
      navigate('/admin/posts');
      toast.success(isEdit ? 'Post updated' : 'Post created');
    },
    onError: () => toast.error('Failed to save post.'),
  });

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
    if (!isEdit) fd.append('draftId', draftIdRef.current);
    return fd;
  };

  const exportAndSave = (statusOverride?: PostStatus) => {
    if (!emailEditorRef.current?.editor) return;
    emailEditorRef.current.editor.exportHtml((data) => {
      designRef.current = data.design;
      saveMutation.mutate(buildFd(data.html, data.design, statusOverride));
    });
  };

  const handlePreview = () => {
    if (!emailEditorRef.current?.editor) return;
    emailEditorRef.current.editor.exportHtml((data) => {
      designRef.current = data.design;
      setForm(prev => ({ ...prev, content: data.html }));
      setView('preview');
    });
  };

  const saveFromPreview = (statusOverride?: PostStatus) => {
    saveMutation.mutate(buildFd(form.content, designRef.current ?? {}, statusOverride));
  };

  const handleFormField = (name: keyof PostForm, value: string) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const isFormValid = form.title.trim() && form.date;

  // ── Preview ───────────────────────────────────────────────────────────────
  if (view === 'preview') {
    const previewImage = images[0]?.preview ?? null;
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <button
            onClick={() => setView('editor')}
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
                onClick={() => saveFromPreview('published')}
                disabled={!isFormValid || saveMutation.isPending}
              >
                {saveMutation.isPending ? 'Publishing…' : 'Publish'}
              </Button>
            )}
            <Button
              variant="outline"
              className="tracking-widest uppercase text-xs rounded-none"
              onClick={() => saveFromPreview('draft')}
              disabled={!isFormValid || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Draft'}
            </Button>
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
              <img src={previewImage} alt={form.title} className="w-full h-auto object-cover max-h-[500px]" />
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

  // ── Editor ────────────────────────────────────────────────────────────────
  if (isEdit && isPostLoading) {
    return <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">Loading post…</div>;
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="tracking-widest uppercase text-xs gap-1.5 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate('/admin/posts')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
          <span className="text-muted-foreground/40">|</span>
          <h2 className="text-base font-medium tracking-wide">
            {isEdit ? 'Edit Post' : 'New Post'}
          </h2>
          <Badge variant={STATUS_CONFIG[form.status].variant} className="text-[10px] px-2">
            {STATUS_CONFIG[form.status].label}
          </Badge>
        </div>
        <Button
          variant="outline"
          className="tracking-widest uppercase text-xs rounded-none gap-1.5"
          onClick={handlePreview}
          disabled={!isFormValid || isCoverUploading || !editorReady}
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
          onChange={e => { if (e.target.files?.length) addImageFiles(e.target.files); e.target.value = ''; }}
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
            {isCoverUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
            {!isCoverUploading && isDragOver && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                <span className="text-white text-xs tracking-widest uppercase">Drop to replace</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
            {!isCoverUploading && (
              <>
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
              </>
            )}
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
            <div
              className="absolute bottom-0 left-0 right-0 h-3 flex items-center justify-center cursor-ns-resize group/handle select-none"
              onMouseDown={e => { e.stopPropagation(); handleResizeMouseDown(e); }}
            >
              <div className="w-10 h-1 rounded-full bg-border group-hover/handle:bg-muted-foreground/60 transition-colors" />
            </div>
          </div>
        )}
      </div>

      {/* Page Builder */}
      <div className="border border-border overflow-hidden">
        <EmailEditor
          ref={emailEditorRef}
          onReady={onEditorReady}
          options={{
            displayMode: 'web',
            features: { stockImages: false, userUploads: false },
          }}
          style={{ height: '70vh' }}
        />
      </div>

      {/* Options */}
      <div>
        <h3 className="text-sm font-medium tracking-wide mb-2">Options</h3>
        <div className="border border-border divide-y divide-border">
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

      {/* Actions */}
      <div className="flex items-center justify-end pt-1 pb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="tracking-widest uppercase text-xs rounded-none"
            onClick={() => navigate('/admin/posts')}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="tracking-widest uppercase text-xs rounded-none"
            onClick={() => exportAndSave('draft')}
            disabled={!isFormValid || saveMutation.isPending || isCoverUploading}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save Draft'}
          </Button>
          {form.status !== 'published' && (
            <Button
              className="tracking-widest uppercase text-xs rounded-none"
              onClick={() => exportAndSave('published')}
              disabled={!isFormValid || saveMutation.isPending || isCoverUploading}
            >
              {saveMutation.isPending ? 'Publishing…' : 'Publish'}
            </Button>
          )}
          {form.status === 'published' && (
            <Button
              className="tracking-widest uppercase text-xs rounded-none"
              onClick={() => exportAndSave()}
              disabled={!isFormValid || saveMutation.isPending || isCoverUploading}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
