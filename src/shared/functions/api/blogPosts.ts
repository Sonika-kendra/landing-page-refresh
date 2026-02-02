import api from './../../../shared/functions/api/';
import { permalink } from '../string';

/** Blog post shape coming from API */
export interface BlogPost {
  _id: string;
  title: string;
  id?: string;
  url?: string;
  params?: string;
  [key: string]: any; // allows extra backend fields
}

export const fetchBlogPosts = async (
  status: string = 'all'
): Promise<BlogPost[]> => {
  const res = await api.get<BlogPost[]>(`/posts/${status}`);

  const blogPosts = res.data.map((blogPost) => {
    const title = blogPost.title;

    blogPost.id = blogPost._id;
    blogPost.url = `/news/post/${permalink(title)}`;
    blogPost.params = `?id=${blogPost.id}`;

    return blogPost;
  });

  return blogPosts;
};
