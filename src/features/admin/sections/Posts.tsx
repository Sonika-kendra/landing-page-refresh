import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, FileText, Pencil, Trash2 } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
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

type PostForm = {
  title: string;
  date: string;
  snippet: string;
  content: string;
  status: PostStatus;
  src: string;
  related: string;
};

const EMPTY_FORM: PostForm = {
  title: '',
  date: new Date().toISOString().slice(0, 16),
  snippet: '',
  content: '',
  status: 'draft',
  src: '',
  related: '',
};

const Posts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [view, setView] = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all');
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setImagePreview(null);
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
      src:     post.src || '',
      related: (post.related || []).join(', '),
    });
    setImagePreview(post.src || null);
    setView('form');
  };

  const handleBack = () => {
    setView('list');
    setImagePreview(null);
  };

  const handleReset = () => {
    if (editPost) {
      setForm({
        title:   editPost.title,
        date:    toDateTimeLocal(editPost.date),
        snippet: editPost.snippet,
        content: editPost.content,
        status:  editPost.status,
        src:     editPost.src || '',
        related: (editPost.related || []).join(', '),
      });
      setImagePreview(editPost.src || null);
    } else {
      setForm(EMPTY_FORM);
      setImagePreview(null);
    }
  };

  const handleFormField = (name: keyof PostForm, value: string) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  }, []);

  const saveMutation = useMutation({
    mutationFn: () => {
      const related = form.related
        ? form.related.split(',').map(s => s.trim()).filter(Boolean)
        : undefined;
      const data = {
        title:   form.title,
        date:    new Date(form.date).toISOString(),
        snippet: form.snippet,
        content: form.content,
        status:  form.status,
        ...(form.src && { src: form.src }),
        ...(related?.length && { related }),
      };
      return editPost
        ? adminApi.updatePost(editPost._id, data)
        : adminApi.createPost(data as Parameters<typeof adminApi.createPost>[0]);
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

        {/* Editor + Image drop zone */}
        <div className="flex border border-border">
          <div className="flex-[3] min-w-0">
            <Editor
              tinymceScriptSrc={`https://cdn.tiny.cloud/1/${import.meta.env.VITE_TINYMCE_API_KEY ?? 'no-api-key'}/tinymce/7/tinymce.min.js`}
              value={form.content}
              onEditorChange={content => handleFormField('content', content)}
              init={{
                height: 380,
                menubar: false,
                statusbar: true,
                resize: false,
                plugins: ['emoticons', 'link', 'lists', 'image', 'wordcount'],
                toolbar: 'emoticons | undo redo | blocks | fontsize | bold italic forecolor | link | alignleft aligncenter alignright alignjustify | bullist numlist',
                content_style: 'body { font-family: inherit; font-size: 12pt; margin: 8px; }',
              }}
            />
          </div>

          {/* Image drop zone */}
          <div
            className={`flex-[1] border-l border-border flex flex-col items-center justify-center min-h-[200px] cursor-pointer select-none transition-colors ${
              isDragOver ? 'bg-muted/40' : 'bg-muted/10 hover:bg-muted/20'
            }`}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleImageDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-center text-muted-foreground text-[11px] tracking-[0.2em] uppercase leading-relaxed px-4">
                CLICK / DROP<br />FILE<br />HERE
              </p>
            )}
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
