import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/shared/functions/api/blogPosts';
import { baseURL } from '@/config/config';

const AUTO_DURATION = 4000;

interface Props {
  posts: BlogPost[];
  visibleCount?: number; // How many posts visible at once
}

const VerticalBlogListWithImage = ({ posts, visibleCount = 4 }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const holdTimeout = useRef<number | null>(null);

  if (!posts.length) return null;

  /* Auto-scroll + progress */
  useEffect(() => {
    if (!posts.length || isPaused) return;

    setProgress(0);
    const start = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / AUTO_DURATION) * 100, 100);
      setProgress(pct);

      if (pct === 100) {
        setActiveIndex((i) => (i + 1) % posts.length);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, posts]);

  /* Pause on touch hold */
  const handleTouchStart = () => {
    holdTimeout.current = window.setTimeout(() => {
      setIsPaused(true);
    }, 150);
  };
  const handleTouchEnd = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
    setIsPaused(false);
  };

  const activePost = posts[activeIndex];
  const featuredImage = activePost?.src ? `${baseURL}${activePost.src}` : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Left: Featured Image */}
      <motion.div className="w-full h-[320px]">
        <motion.img
          key={featuredImage}
          src={featuredImage}
          alt={activePost.title}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>

      {/* Right: Post list */}
      <div
        className={`relative overflow-hidden h-[${visibleCount * 80}px]`} 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.ul
          animate={{ y: -activeIndex * 80 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {posts.map((post, index) => (
            <li
              key={post.id || post._id}
              onMouseEnter={() => setActiveIndex(index)}
              className={`py-3 px-2 rounded-md cursor-pointer transition-all ${
                index === activeIndex
                  ? 'bg-[#fdf6e3] font-semibold border-l-4 border-[#b59b6a]'
                  : 'bg-transparent font-light'
              }`}
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
                className={`text-gray-800 hover:text-[#b59b6a] block`}
              >
                {post.title}
              </Link>

              {post.snippet && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {post.snippet}
                </p>
              )}
            </li>
          ))}
        </motion.ul>

        {/* Progress indicator */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col gap-2 w-[2px]">
          {posts.map((_, i) => (
            <div key={i} className="w-full bg-gray-200 flex-1">
              <motion.div
                className="w-full bg-[#b59b6a]"
                animate={{
                  height:
                    i === activeIndex
                      ? `${progress}%`
                      : i < activeIndex
                      ? '100%'
                      : '0%',
                }}
                transition={{ ease: 'linear' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalBlogListWithImage;
