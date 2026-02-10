import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/shared/functions/api/blogPosts';
import { baseURL, oldWebsiteURL } from '@/config/config';

const AUTO_DURATION = 4000;
const ITEM_HEIGHT = 80;

interface Props {
  posts: BlogPost[];
  visibleCount?: number;
}

const VerticalBlogListWithImage = ({ posts, visibleCount = 4 }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const holdTimeout = useRef<number | null>(null);

  if (!posts.length) return null;

  /* Auto-scroll */
  useEffect(() => {
    if (isPaused) return;

    setProgress(0);
    const start = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / AUTO_DURATION) * 100, 100);
      setProgress(pct);

      if (pct === 100) {
        setActiveIndex((i) => (i + 1) % posts.length);
        listRef.current?.scrollTo({
          top: (activeIndex + 1) * ITEM_HEIGHT,
          behavior: 'smooth',
        });
      }
    }, 50);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, posts.length]);

  /* Sync active item on manual scroll */
  useEffect(() => {
    if (!listRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!Number.isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: listRef.current,
        threshold: 0.6,
      }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [posts]);

  /* Pause on user interaction */
  const handleTouchStart = () => {
    holdTimeout.current = window.setTimeout(() => {
      setIsPaused(true);
    }, 100);
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
    <>
      {/* Scrollbar styles */}
      <style>{`
        .blog-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .blog-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .blog-scrollbar::-webkit-scrollbar-thumb {
          background-color: #b59b6a;
          border-radius: 6px;
        }
        .blog-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #b59b6a transparent;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Featured Image */}
        <motion.div className="w-full h-[320px]">
          <motion.img
            key={featuredImage}
            src={featuredImage}
            alt={activePost.title}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover rounded-lg"
          />
        </motion.div>

        {/* Right: Scrollable Blog List */}
        <div
          ref={listRef}
          className="relative overflow-y-auto pr-4 blog-scrollbar"
          style={{ height: visibleCount * ITEM_HEIGHT }}
          onWheel={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ul>
            {posts.map((post, index) => (
              <li
                key={post.id || post._id}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
                className={`py-3 px-2 mb-1 rounded-md transition-all ${
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
                  to={`${oldWebsiteURL}/news`}
                  className="text-gray-800 hover:text-[#b59b6a] block"
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
          </ul>

          {/* Progress Indicator */}
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
    </>
  );
};

export default VerticalBlogListWithImage;
