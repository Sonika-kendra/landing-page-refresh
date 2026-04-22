import api from './client';
import { permalink } from '@/lib/string';

export interface BlogPost {
  _id: string;
  title: string;
  id?: string;
  url?: string;
  params?: string;
  [key: string]: any;
}

export const fetchBlogPosts = async (status: string = 'all'): Promise<BlogPost[]> => {
  const res = await api.get<BlogPost[]>(`/posts/${status}`);

  return res.data.map((blogPost) => {
    const title = blogPost.title;
    blogPost.id = blogPost._id;
    blogPost.url = `/news/post/${permalink(title)}`;
    blogPost.params = `?id=${blogPost.id}`;
    return blogPost;
  });
};
