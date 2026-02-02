import { useEffect, useState } from 'react';
import { fetchBlogPosts, BlogPost } from '@/shared/functions/api/blogPosts';
import VerticalBlogListWithImage from './blog/VerticalBlogCarousel';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">
          Read Through our Blog
        </h2>

        <VerticalBlogListWithImage posts={posts} visibleCount={4} />

        {/* Animated Button like FeaturesSection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            className="btn-henig-outline"
            size="sm"
            asChild
          >
            <a href="/news">GO TO OUR BLOG</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
