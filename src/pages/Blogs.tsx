import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

import ImageWithSkeleton from '@/components/shared/ImageWithSkeleton';
import PageLayout from '@/components/shared/PageLayout';
import RegistrationModal from '@/components/shared/RegistrationModal';
import { baseURL, websiteUrlConfig } from '@/config/config';
import { BlogPost, fetchBlogPosts } from '@/shared/functions/api/blogPosts';

const getPostLink = (post: BlogPost) => `${websiteUrlConfig.Blogs}/${post.id}${post.params || ''}`;

const getPostImage = (post: BlogPost) => (post.src ? `${baseURL}${post.src}` : '');

const getPostTimestamp = (date?: string) => {
  if (!date) return 0;

  const timestamp = new Date(date).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const formatPostDate = (date?: string) => {
  if (!date) return 'Coming soon';

  const timestamp = getPostTimestamp(date);
  if (!timestamp) return 'Coming soon';

  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getPostExcerpt = (post: BlogPost, maxLength = 160) => {
  const source = stripHtml(post.snippet || post.content || post.body || '');
  if (!source) return 'Discover more from Henig Diamonds in our latest editorial insights and trade updates.';
  if (source.length <= maxLength) return source;

  return `${source.slice(0, maxLength).trimEnd()}...`;
};

const getReadingTime = (post: BlogPost) => {
  if (typeof post.readTime === 'number' && post.readTime > 0) {
    return `${post.readTime} min read`;
  }

  if (typeof post.readingTime === 'number' && post.readingTime > 0) {
    return `${post.readingTime} min read`;
  }

  const wordCount = stripHtml(post.content || post.body || post.snippet || '').split(' ').filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(wordCount / 180));

  return `${minutes} min read`;
};

const cardSurfaceClass =
  'border border-[#ecebe5] bg-card shadow-[0_22px_38px_-32px_rgba(16,24,22,0.48)] transition-colors duration-300';

const MetaRow = ({ post }: { post: BlogPost }) => (
  <div className="flex items-center gap-2 text-[12px] text-foreground/55">
    <Calendar className="h-3.5 w-3.5 shrink-0 text-foreground/45" />
    <span className="font-medium">{formatPostDate(post.date)}</span>
  </div>
);

const ReadMoreRow = ({ post }: { post: BlogPost }) => (
  <div className="mt-auto flex items-center justify-between gap-4 pt-4 text-[0.95rem] text-primary/85">
    <span>{getReadingTime(post)}</span>
    <span className="inline-flex items-center gap-1.5 font-medium text-primary">
      Read More
      <ArrowRight className="h-3.5 w-3.5" />
    </span>
  </div>
);

const BlogImage = ({
  post,
  className,
  wrapperClassName,
  priority = false,
}: {
  post: BlogPost;
  className: string;
  wrapperClassName: string;
  priority?: boolean;
}) => {
  const image = getPostImage(post);

  if (!image) {
    return (
      <div className={`${wrapperClassName} flex items-center justify-center bg-[#ebe8df] px-8 text-center`}>
        <span className="font-serif text-2xl leading-tight text-foreground/70">{post.title}</span>
      </div>
    );
  }

  return (
    <ImageWithSkeleton
      src={image}
      alt={post.title}
      wrapperClassName={wrapperClassName}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

const StandardBlogCard = ({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: index * 0.06, duration: 0.45 }}
    className="group h-full"
  >
    <Link
      to={getPostLink(post)}
      className={`flex h-full flex-col overflow-hidden ${cardSurfaceClass} hover:border-primary/40`}
    >
      <BlogImage
        post={post}
        wrapperClassName="aspect-[11/9] overflow-hidden bg-[#ebe8df]"
        className="h-full w-full object-cover"
        priority={index < 3}
      />

      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-4 md:px-7 md:pb-7">
        <MetaRow post={post} />
        <div className="space-y-2.5">
          <h2 className="font-serif text-[1.9rem] leading-[1.22] text-foreground md:text-[2.15rem]">
            {post.title}
          </h2>
          <p className="text-[0.93rem] leading-7 text-foreground/72">{getPostExcerpt(post, 120)}</p>
        </div>
        <ReadMoreRow post={post} />
      </div>
    </Link>
  </motion.article>
);

const CompactBlogCard = ({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    className={`group overflow-hidden ${cardSurfaceClass}`}
  >
    <Link to={getPostLink(post)} className="flex h-full flex-col">
      <BlogImage
        post={post}
        wrapperClassName="aspect-[11/9] overflow-hidden bg-[#ebe8df]"
        className="h-full w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-4">
        <MetaRow post={post} />
        <h3 className="font-serif text-[2rem] leading-[1.25] text-foreground">
          {post.title}
        </h3>
        <p className="text-[0.93rem] leading-7 text-foreground/72">{getPostExcerpt(post, 92)}</p>
        <ReadMoreRow post={post} />
      </div>
    </Link>
  </motion.article>
);

const FeaturedBlogCard = ({ post }: { post: BlogPost }) => (
  <motion.article
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
    className={`overflow-hidden ${cardSurfaceClass}`}
  >
    <Link to={getPostLink(post)} className="grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.88fr)]">
      <div className="flex flex-col justify-between p-7 md:p-8 lg:p-9">
        <div className="space-y-5">
          <MetaRow post={post} />
          <h2 className="max-w-[14ch] font-serif text-[2.35rem] leading-[1.2] text-foreground md:text-[2.9rem]">
            {post.title}
          </h2>
          <p className="max-w-[28rem] text-[1.02rem] leading-8 text-foreground/72">
            {getPostExcerpt(post, 160)}
          </p>
        </div>
        <ReadMoreRow post={post} />
      </div>

      <BlogImage
        post={post}
        wrapperClassName="h-[230px] overflow-hidden bg-[#ebe8df] md:h-[320px] lg:h-full"
        className="h-full w-full object-cover"
      />
    </Link>
  </motion.article>
);

const SpotlightBlogCard = ({ post }: { post: BlogPost }) => {
  const leadCopy = getPostExcerpt(post, 200);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className={`overflow-hidden ${cardSurfaceClass}`}
    >
      <Link
        to={getPostLink(post)}
        className="grid gap-0 md:grid-cols-[minmax(0,0.93fr)_minmax(0,1.35fr)] md:items-stretch"
      >
        <div className="flex flex-col p-7 md:p-8 lg:p-9">
          <MetaRow post={post} />
          <h2 className="mt-7 font-serif text-[2.3rem] leading-[1.2] text-foreground md:text-[3rem]">
            {post.title}
          </h2>
          <div className="mt-8 text-[1.02rem] leading-8 text-foreground/72">
            <p>{leadCopy}</p>
          </div>
          <ReadMoreRow post={post} />
        </div>

        <BlogImage
          post={post}
          wrapperClassName="h-[230px] overflow-hidden bg-[#ebe8df] md:h-[320px] lg:h-full"
          className="h-full w-full object-cover"
        />
      </Link>
    </motion.article>
  );
};

const EmptyState = () => (
  <div
    className={`mx-auto max-w-2xl px-8 py-16 text-center ${cardSurfaceClass}`}
  >
    <h2 className="henig-heading-section mb-4">No blog posts available yet</h2>
    <p className="henig-body text-foreground/70">
      New stories and trade insights will appear here once they are published.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="space-y-10">
    <div className="grid gap-8 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className={`overflow-hidden ${cardSurfaceClass}`}>
          <div className="aspect-[11/9] animate-pulse bg-border/40" />
          <div className="space-y-4 p-6 md:p-7">
            <div className="h-3 w-32 animate-pulse rounded bg-border/40" />
            <div className="h-10 w-4/5 animate-pulse rounded bg-border/40" />
            <div className="h-20 w-full animate-pulse rounded bg-border/40" />
          </div>
        </div>
      ))}
    </div>

    <div className={`grid overflow-hidden ${cardSurfaceClass} lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]`}>
      <div className="space-y-4 p-7 md:p-9">
        <div className="h-3 w-32 animate-pulse rounded bg-border/40" />
        <div className="h-16 w-3/4 animate-pulse rounded bg-border/40" />
        <div className="h-24 w-full animate-pulse rounded bg-border/40" />
      </div>
      <div className="min-h-[260px] animate-pulse bg-border/40 lg:min-h-[360px]" />
    </div>
  </div>
);

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogPosts('published');
        const orderedPosts = [...data].sort((a, b) => getPostTimestamp(b.date) - getPostTimestamp(a.date));
        setPosts(orderedPosts);
      } catch (error) {
        console.error('Failed to load blog posts', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const firstRow = posts.slice(0, 3);
  const featuredPost = posts[3];
  const secondRow = posts.slice(4, 7);
  const spotlightPost = posts[7];
  const sidePosts = posts.slice(8, 9);
  const archivePosts = posts.slice(9);

  return (
    <PageLayout onRegisterClick={() => setIsRegisterModalOpen(true)}>
      <section className="bg-accent py-16 text-accent-foreground md:py-24">
        <div className="henig-container flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="font-serif text-[3rem] font-medium tracking-tight md:text-[4.25rem]"
          >
            Our Latest news
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="mt-5 h-px w-52 origin-center bg-primary/80"
          />
        </div>
      </section>

      <section className="section-ivory py-12 md:py-16">
        <div className="henig-container space-y-12 md:space-y-16">
          {loading ? (
            <LoadingState />
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
               {firstRow.length > 0 && (
                <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
                  {firstRow.map((post, index) => (
                    <StandardBlogCard key={post.id || post._id} post={post} index={index} />
                  ))}
                </div>
              )}

              {featuredPost && <FeaturedBlogCard post={featuredPost} />}

              {secondRow.length > 0 && (
                <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
                  {secondRow.map((post, index) => (
                    <StandardBlogCard key={post.id || post._id} post={post} index={index} />
                  ))}
                </div>
              )}

              {(spotlightPost || sidePosts.length > 0) && (
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_320px] xl:gap-10">
                  <div>{spotlightPost && <SpotlightBlogCard post={spotlightPost} />}</div>

                  {sidePosts.length > 0 && (
                    <div className="space-y-8 self-start">
                      {sidePosts.map((post, index) => (
                        <CompactBlogCard key={post.id || post._id} post={post} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {archivePosts.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {archivePosts.map((post, index) => (
                    <StandardBlogCard key={post.id || post._id} post={post} index={index} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </PageLayout>
  );
};

export default Blogs;
