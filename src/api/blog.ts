import api from './client';
import { API_CONFIG } from './config';
import { permalink } from '@/lib/string';

export interface BlogPost {
  _id: string;
  title: string;
  id?: string;
  url?: string;
  params?: string;
  [key: string]: any;
}

const { base, endpoints } = API_CONFIG.blog;

export const fetchBlogPosts = async (status: string = 'all'): Promise<BlogPost[]> => {
  const res = await api.get<BlogPost[]>(endpoints.posts(status), undefined, undefined, false, base);

  return res.data.map((blogPost) => {
    const title = blogPost.title;
    blogPost.id = blogPost._id;
    blogPost.url = `/news/post/${permalink(title)}`;
    blogPost.params = `?id=${blogPost.id}`;
    return blogPost;
  });
};
