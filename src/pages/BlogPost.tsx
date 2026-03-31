import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { baseURL, websiteUrlConfig } from '@/config/config';
import { fetchBlogPosts, BlogPost as BlogPostType } from '@/shared/functions/api/blogPosts';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPost = () => {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPostType[]>([]);
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
        const posts = await fetchBlogPosts('published');
        setAllPosts(posts);
        const found = posts.find((p) => p._id === postId || p.id === postId);
        if (found) {
          setPost(found);
        } else {
          setError(true);
        }
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

  // Recent posts excluding current, sorted by date descending
  const recentPosts = allPosts
    .filter((p) => (p._id || p.id) !== postId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      <section className="py-12 md:py-20 section-ivory min-h-[60vh]">
        <div className="henig-container">
          {/* Back link */}
          <Link to={`${websiteUrlConfig.Blogs}`} className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wide uppercase">Back to Blog</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            {/* Main content */}
            <div>
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
                    <Link to={websiteUrlConfig.Blogs}>View All Posts</Link>
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

            {/* Right sidebar – newest blogs */}
            <aside className="lg:sticky lg:top-24 self-start">
              <h3 className="font-serif text-lg text-foreground mb-6 pb-3 border-b border-border">
                Latest Posts
              </h3>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-3 bg-border/40 rounded w-1/3" />
                      <div className="h-4 bg-border/40 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-5">
                  {recentPosts.map((p, index) => {
                    const thumb = p.src ? `${baseURL}${p.src}` : '';
                    return (
                      <motion.li
                        key={p._id || p.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`${websiteUrlConfig.Blogs}/${p.id}${p.params || ''}`}
                          className="group flex gap-3 items-start"
                        >
                          {thumb && (
                            <img
                              src={thumb}
                              alt={p.title}
                              className="w-16 h-16 rounded-sm object-cover flex-shrink-0"
                              loading="lazy"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            {p.date && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(p.date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
                              {p.title}
                            </p>
                          </div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              )}

              <Link
                to={websiteUrlConfig.Blogs}
                className="inline-flex items-center gap-1 text-primary text-sm mt-6 font-medium hover:underline"
              >
                View All Posts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default BlogPost;
