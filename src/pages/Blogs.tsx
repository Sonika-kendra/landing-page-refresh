import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogPosts, BlogPost } from '@/shared/functions/api/blogPosts';
import { baseURL } from '@/config/config';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogPosts('published');
        setPosts(data);
      } catch (error) {
        console.error('Failed to load blog posts', error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      {/* Hero */}
      <section className="bg-accent text-accent-foreground py-10 md:py-14">
        <div className="henig-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="henig-heading-display mb-4"
          >
            Our Latest News
          </motion.h1>
          {/* <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="henig-body-large text-accent-foreground/70 max-w-2xl mx-auto"
          >
            Stay updated with the latest news, events, and insights from Henig Diamonds.
          </motion.p> */}
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 md:py-24 section-ivory">
        <div className="henig-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-sm animate-pulse">
                  <div className="h-56 bg-border/40 rounded-t-sm" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-border/40 rounded w-1/3" />
                    <div className="h-5 bg-border/40 rounded w-3/4" />
                    <div className="h-4 bg-border/40 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground henig-body-large">No blog posts available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => {
                const image = post.src ? `${baseURL}${post.src}` : '';
                return (
                  <motion.article
                    key={post.id || post._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-sm overflow-hidden group hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300"
                  >
                    <Link to={`/blogs/${post.id}${post.params || ''}`}>
                      {image && (
                        <div className="h-56 overflow-hidden">
                          <img
                            src={image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {post.date && (
                          <div className="flex items-center gap-2 text-muted mb-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs tracking-wide">
                              {new Date(post.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                        <h2 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        {post.snippet && (
                          <p className="text-sm text-muted line-clamp-3">{post.snippet}</p>
                        )}
                        <span className="inline-flex items-center gap-1 text-primary text-sm mt-4 font-medium">
                          Read More <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default Blogs;
