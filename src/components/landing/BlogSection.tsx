import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogPosts } from '../../shared/functions/api/blogPosts';
import { BlogPost } from '../../shared/functions/api/blogPosts'; // adjust if path differs
import { baseURL } from '@/shared/functions/api';

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogPosts('published');
        const latestPosts = data.slice(0, 3);

        setPosts(latestPosts);
        setActivePost(latestPosts[0]); // 👈 default image
      } catch (error) {
        console.error('Failed to load blog posts', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  if (loading || posts.length === 0) return null;

  // const featuredImage = `${baseURL}${posts[0]?.src}`;
  const featuredImage = activePost?.src ? `${baseURL}${activePost.src}` : '';

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">
          Read Through our Blog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div>
            {featuredImage && (
              <img
                src={featuredImage}
                alt={activePost?.title}
                className="w-full h-[320px] object-cover transition-all duration-300"
              />
            )}
          </div>

          {/* Right Content */}
          <div>
            <ul className="space-y-6">
              {posts.map((post) => (
                <li
                  key={post.id || post._id}
                  onMouseEnter={() => setActivePost(post)} // 👈 magic
                  className="cursor-pointer"
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(post.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  <Link
                    to={`${post.url}${post.params}`}
                    className={`text-lg font-light block transition
                      ${activePost?.id === post.id
                        ? 'text-[#b59b6a]'
                        : 'text-gray-800 hover:underline'}
                    `}
                  >
                    {post.title}
                  </Link>

                  {post.snippet && (
                    <p className="text-sm text-gray-500 mt-1">
                      {post.snippet}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <Link
                to="/news"
                className="inline-block border border-[#b59b6a] text-[#b59b6a] px-6 py-2 text-sm tracking-wide hover:bg-[#b59b6a] hover:text-white transition"
              >
                GO TO OUR BLOG
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
