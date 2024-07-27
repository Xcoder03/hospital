import { User } from '../models/user';
import { Post } from '../models/post';
import { Category } from '../models/category';

interface PostPayload {
  userId: string;
  content: string;
  imageUrl: string;
  categoryId: string;
}

export const createPost = async (postPayload: PostPayload) => {
  const user = await User.findOne({ where: { id: parseInt(postPayload.userId, 10) } });
  if (!user) throw new Error('User not found');

  const category = await Category.findOptions({ where: { id: parseInt(postPayload.categoryId, 10) } });
  if (!category) throw new Error('Category not found');

  const post = Post.create({
    content: postPayload.content,
    imageUrl: postPayload.imageUrl,
    user,
    category,
  });
  await post.save();

  return post;
};


export const editPost = async (postId: string, updatedContent: string, updatedImageUrl: string) => {
    const post = await Post.findOne({ where: { id: parseInt(postId, 10) } });
    if (!post) throw new Error('Post not found');
  
    post.content = updatedContent;
    post.imageUrl = updatedImageUrl;
    await post.save();
  
    return post;
  };

  export const deletePost = async (postId: string) => {
    const post = await Post.findOne({ where: { id: parseInt(postId, 10) } });
    if (!post) throw new Error('Post not found');
  
    await post.remove();
  };
  export const getPosts = async () => {
    const posts = await Post.find();
    return posts;
  };
  
  export const getPostById = async (postId: string) => {
    const post = await Post.findOne({ where: { id: parseInt(postId, 10) } });
    if (!post) throw new Error('Post not found');
    return post;
  };
    
  
