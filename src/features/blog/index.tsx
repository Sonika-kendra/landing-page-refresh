import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import ImageWithSkeleton from '@/components/shared/common/ImageWithSkeleton';
import PageLayout from '@/components/shared/layout/PageLayout';
import { newApiURL, websiteUrlConfig } from '@/config/site';
import { BlogPost, fetchBlogPosts } from '@/api/blog';

const getPostLink = (post: BlogPost) => `${websiteUrlConfig.Blogs}/${post.id}${post.params || ''}`;
const getPostImage = (post: BlogPost) => {
  if (!post.src) return '';
  // WorkDrive images are served via the proxy; use relative path
  if (post.src.startsWith('/posts/image/')) return post.src;
  return post.src.startsWith('http') ? post.src : `${newApiURL}${post.src}`;
};
const getPostTimestamp = (date?: string) => {
  if (!date) return 0;
  const timestamp = new Date(date).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};
const formatPostDate = (date?: string) => {
  if (!date) return 'Coming soon';
  const timestamp = getPostTimestamp(date);
  if (!timestamp) return 'Coming soon';
  return new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};
const stripHtml = (value = '') =>
  value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const getReadingTime = (post: BlogPost) => {
  if (typeof post.readTime === 'number' && post.readTime > 0) return `${post.readTime} min read`;
  if (typeof post.readingTime === 'number' && post.readingTime > 0) return `${post.readingTime} min read`;
  const wordCount = stripHtml(post.content || post.body || post.snippet || '').split(' ').filter(Boolean).length;
  return `${Math.max(3, Math.ceil(wordCount / 180))} min read`;
};

const getExcerpt = (post: BlogPost, maxLength = 160) => {
  const title = (post.title || '').trim().toLowerCase();
  const candidates = [post.snippet, post.excerpt, post.summary, post.description, post.subtitle, stripHtml(post.content || post.body || '')];
  const text = candidates.find(c => {
    if (!c) return false;
    const t = c.trim();
    return t.length > 0 && t.toLowerCase() !== title;
  }) || '';
  if (!text) return 'Read our latest insights and stories from the world of fine diamonds and jewellery.';
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
};

const cardSurfaceClass = 'border border-[#ecebe5] bg-card shadow-[0_22px_38px_-32px_rgba(16,24,22,0.48)] transition-all duration-300 hover:shadow-[0_32px_60px_-12px_rgba(16,24,22,0.42)] hover:border-primary/40';
const blogPageContainerClass = 'mx-auto w-full px-4 sm:px-6 lg:px-10 2xl:px-14';

const MetaRow = ({ post }: { post: BlogPost }) => {
  const category = post.category || (Array.isArray(post.categories) ? post.categories[0] : null) || (Array.isArray(post.tags) ? post.tags[0] : null) || (typeof post.tags === 'string' ? post.tags : null);
  const author = post.author || post.authorName || post.author_name;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-foreground/55">
      {category && <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary/75">{category}</span>}
      <Calendar className="h-3.5 w-3.5 shrink-0 text-foreground/45" />
      <span className="font-medium">{formatPostDate(post.date)}</span>
      {author && <><span className="text-foreground/30">·</span><span className="font-medium">{author}</span></>}
    </div>
  );
};

const ReadMoreRow = ({ post }: { post: BlogPost }) => (
  <div className="mt-auto flex items-center justify-between gap-4 pt-4 text-[0.9rem] text-primary/85 md:text-[0.95rem]">
    <span>{getReadingTime(post)}</span>
    <span className="inline-flex items-center gap-1.5 font-medium text-primary">Read More <ArrowRight className="h-3.5 w-3.5" /></span>
  </div>
);

const BlogImage = ({ post, className, wrapperClassName, priority = false }: { post: BlogPost; className: string; wrapperClassName: string; priority?: boolean }) => {
  const image = getPostImage(post);
  if (!image) {
    return (
      <div className={`${wrapperClassName} flex items-center justify-center bg-[#ebe8df] px-8 text-center`}>
        <span className="font-serif text-2xl leading-tight text-foreground/70">{post.title}</span>
      </div>
    );
  }
  return <ImageWithSkeleton src={image} alt={post.title} wrapperClassName={wrapperClassName} className={className} loading={priority ? 'eager' : 'lazy'} />;
};

const StandardBlogCard = ({ post, index }: { post: BlogPost; index: number }) => (
  <motion.article id={`post-${post._id}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4, transition: { duration: 0.18 } }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.06, duration: 0.45 }} className="group h-full">
    <Link to={getPostLink(post)} className={`flex h-full flex-col overflow-hidden ${cardSurfaceClass} hover:border-primary/40`}>
      <BlogImage post={post} wrapperClassName="mx-auto mt-5 aspect-[11/9] w-[76%] overflow-hidden bg-[#ebe8df]" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" priority={index < 3} />
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-4 md:px-6 md:pb-6">
        <MetaRow post={post} />
        <div className="space-y-2.5">
          <h2 className="font-serif text-[1.35rem] leading-[1.22] text-foreground md:text-[1.55rem] line-clamp-2">{post.title}</h2>
          <p className="text-[0.9rem] text-foreground/60 leading-snug line-clamp-2">{getExcerpt(post, 120)}</p>
        </div>
        <ReadMoreRow post={post} />
      </div>
    </Link>
  </motion.article>
);

const CompactBlogCard = ({ post, index }: { post: BlogPost; index: number }) => (
  <motion.article id={`post-${post._id}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4, transition: { duration: 0.18 } }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05, duration: 0.4 }} className={`group overflow-hidden ${cardSurfaceClass}`}>
    <Link to={getPostLink(post)} className="flex h-full flex-col">
      <BlogImage post={post} wrapperClassName="mx-auto mt-5 aspect-[11/9] w-[76%] overflow-hidden bg-[#ebe8df]" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-4">
        <MetaRow post={post} />
        <h3 className="font-serif text-[1.25rem] leading-[1.25] text-foreground md:text-[1.4rem] line-clamp-2">{post.title}</h3>
        <p className="text-[0.9rem] text-foreground/60 leading-snug line-clamp-2">{getExcerpt(post, 180)}</p>
        <ReadMoreRow post={post} />
      </div>
    </Link>
  </motion.article>
);

const FeaturedBlogCard = ({ post }: { post: BlogPost }) => (
  <motion.article id={`post-${post._id}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4, transition: { duration: 0.18 } }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className={`group overflow-hidden lg:h-[420px] ${cardSurfaceClass}`}>
    <Link to={getPostLink(post)} className="grid h-full lg:grid-cols-[minmax(0,2fr)_minmax(0,4fr)]">
      <div className="flex flex-col justify-between p-6 md:p-7 lg:p-8">
        <div className="space-y-5">
          <MetaRow post={post} />
          <div className="space-y-2.5">
            <h2 className="font-serif text-[1.6rem] leading-[1.2] text-foreground md:text-[2rem]">{post.title}</h2>
            <p className="text-[1rem] text-foreground/60 leading-snug line-clamp-6">{getExcerpt(post, 400)}</p>
          </div>
        </div>
        <ReadMoreRow post={post} />
      </div>
      <div className="flex flex-col overflow-hidden h-[190px] md:h-[260px] lg:h-full p-5">
        <BlogImage post={post} wrapperClassName="flex-1 overflow-hidden bg-[#ebe8df]" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
    </Link>
  </motion.article>
);

const SpotlightBlogCard = ({ post }: { post: BlogPost }) => (
  <motion.article id={`post-${post._id}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4, transition: { duration: 0.18 } }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className={`group h-full overflow-hidden ${cardSurfaceClass}`}>
    <Link to={getPostLink(post)} className="grid h-full md:grid-cols-[2fr_3fr] md:items-stretch">
      <div className="flex flex-col justify-between p-6 md:p-7 lg:p-8">
        <div className="space-y-5">
          <MetaRow post={post} />
          <div className="space-y-2.5">
            <h2 className="font-serif text-[2rem] leading-[1.2] text-foreground md:text-[2.5rem]">{post.title}</h2>
            {getExcerpt(post, 300) && <p className="text-[1.1rem] text-foreground/60 leading-relaxed">{getExcerpt(post, 875)}</p>}
          </div>
        </div>
        <ReadMoreRow post={post} />
      </div>
      <div className="flex flex-col overflow-hidden h-[190px] md:h-full p-3">
        <BlogImage post={post} wrapperClassName="flex-1 overflow-hidden bg-[#ebe8df]" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
    </Link>
  </motion.article>
);

const EmptyState = () => (
  <div className={`mx-auto max-w-2xl px-8 py-16 text-center ${cardSurfaceClass}`}>
    <h2 className="henig-heading-section mb-4">No blog posts available yet</h2>
    <p className="henig-body text-foreground/70">New stories and trade insights will appear here once they are published.</p>
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
  </div>
);

type BlogLayoutGroup = {
  startIndex: number;
  firstRow: BlogPost[];
  secondRow: BlogPost[];
  featuredPost?: BlogPost;
  thirdRow: BlogPost[];
  spotlightPost?: BlogPost;
  sidePosts: BlogPost[];
};

const postsPerLayoutGroup = 13;
const getPostKey = (post: BlogPost) => post.id || post._id;

const getBlogLayoutGroups = (blogPosts: BlogPost[]): BlogLayoutGroup[] => {
  const groups: BlogLayoutGroup[] = [];
  for (let startIndex = 0; startIndex < blogPosts.length; startIndex += postsPerLayoutGroup) {
    const groupPosts = blogPosts.slice(startIndex, startIndex + postsPerLayoutGroup);
    groups.push({
      startIndex,
      firstRow: groupPosts.slice(0, 3),
      secondRow: groupPosts.slice(3, 6),
      featuredPost: groupPosts[6],
      thirdRow: groupPosts.slice(7, 10),
      spotlightPost: groupPosts[10],
      sidePosts: groupPosts.slice(11, 13),
    });
  }
  return groups;
};

const BlogLayoutGroupSection = ({ group }: { group: BlogLayoutGroup }) => (
  <>
    {group.firstRow.length > 0 && (
      <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
        {group.firstRow.map((post, index) => <StandardBlogCard key={getPostKey(post)} post={post} index={group.startIndex + index} />)}
      </div>
    )}
    {group.secondRow.length > 0 && (
      <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
        {group.secondRow.map((post, index) => <StandardBlogCard key={getPostKey(post)} post={post} index={group.startIndex + group.firstRow.length + index} />)}
      </div>
    )}
    {group.featuredPost && <FeaturedBlogCard post={group.featuredPost} />}
    {group.thirdRow.length > 0 && (
      <div className="grid gap-8 lg:grid-cols-3 xl:gap-10">
        {group.thirdRow.map((post, index) => <StandardBlogCard key={getPostKey(post)} post={post} index={group.startIndex + group.firstRow.length + group.secondRow.length + 1 + index} />)}
      </div>
    )}
    {(group.spotlightPost || group.sidePosts.length > 0) && (
      <div className="grid gap-8 xl:grid-cols-[2fr_1fr] xl:gap-10">
        <div>{group.spotlightPost && <SpotlightBlogCard post={group.spotlightPost} />}</div>
        {group.sidePosts.length > 0 && (
          <div className="space-y-8 self-start">
            {group.sidePosts.map((post, index) => <CompactBlogCard key={getPostKey(post)} post={post} index={index} />)}
          </div>
        )}
      </div>
    )}
  </>
);

const Blogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogPosts('published');
        setPosts([...data].sort((a, b) => getPostTimestamp(b.date) - getPostTimestamp(a.date)));
      } catch (error) {
        console.error('Failed to load blog posts', error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0 && location.state?.scrollToPost) {
      const id = location.state.scrollToPost as string;
      setTimeout(() => {
        const el = document.getElementById(`post-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [loading, posts.length, location.state]);

  const blogLayoutGroups = getBlogLayoutGroups(posts);

  return (
    <PageLayout>
      <section className="bg-accent py-16 md:py-24 text-accent-foreground">
        <div className={`${blogPageContainerClass} flex flex-col items-center text-center`}>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="font-serif text-[3rem] font-medium tracking-tight md:text-[4.25rem]">
            Our Latest News
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="mt-4 text-base md:text-lg text-accent-foreground/70 max-w-xl">
            Insights, stories and updates from the world of fine diamonds and jewellery.
          </motion.p>
          <motion.span initial={{ opacity: 0, scaleX: 0.8 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.2, duration: 0.45 }} className="mt-5 h-px w-52 origin-center bg-primary/80" />
        </div>
      </section>
      <section className="py-12 md:py-16 bg-white">
        <div className={`${blogPageContainerClass} space-y-12 md:space-y-16`}>
          {loading ? <LoadingState /> : posts.length === 0 ? <EmptyState /> : (
            <>{blogLayoutGroups.map((group) => <BlogLayoutGroupSection key={group.startIndex} group={group} />)}</>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Blogs;
