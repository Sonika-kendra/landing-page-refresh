import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { baseURL } from '@/config/config';
import api from '@/shared/functions/api';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullBlogPost {
  _id: string;
  title: string;
  content?: string;
  body?: string;
  date?: string;
  src?: string;
  snippet?: string;
  [key: string]: any;
}

const BlogPost = () => {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const [post, setPost] = useState<FullBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (!postId) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        const res = await api.get<FullBlogPost>(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.error('Failed to load blog post', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [postId]);

  const featuredImage = post?.src ? `${baseURL}${post.src}` : '';
  const htmlContent = post?.content || post?.body || '';

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      <section className="py-12 md:py-20 section-ivory min-h-[60vh]">
        <div className="henig-container max-w-3xl">
          {/* Back link */}
          <Link to="/blogs" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wide uppercase">Back to Blog</span>
          </Link>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-border/40 rounded w-3/4" />
              <div className="h-4 bg-border/40 rounded w-1/4" />
              <div className="h-80 bg-border/40 rounded" />
              <div className="space-y-3">
                <div className="h-4 bg-border/40 rounded w-full" />
                <div className="h-4 bg-border/40 rounded w-5/6" />
                <div className="h-4 bg-border/40 rounded w-4/5" />
              </div>
            </div>
          ) : error || !post ? (
            <div className="text-center py-20">
              <h2 className="henig-heading-section mb-4">Post Not Found</h2>
              <p className="text-muted mb-8">The blog post you're looking for doesn't exist or couldn't be loaded.</p>
              <Button className="btn-henig-outline" asChild>
                <Link to="/blogs">View All Posts</Link>
              </Button>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="henig-heading-display text-3xl md:text-4xl mb-4">{post.title}</h1>

              {post.date && (
                <div className="flex items-center gap-2 text-muted mb-8">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(post.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {featuredImage && (
                <div className="mb-10 rounded-sm overflow-hidden">
                  <img
                    src={featuredImage}
                    alt={post.title}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              )}

              {htmlContent ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : post.snippet ? (
                <p className="henig-body-large text-foreground/80">{post.snippet}</p>
              ) : (
                <p className="text-muted">No content available for this post.</p>
              )}
            </motion.article>
          )}
        </div>
      </section>

      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default BlogPost;
