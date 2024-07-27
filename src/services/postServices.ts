// src/services/PostService.ts
import { getRepository, Repository } from 'typeorm';
import { Post } from '../models/post';
import { User } from '../models/user';
import { Category } from '../models/category';
import { Comment } from '../models/comment';
import { HttpError } from '../errors/HttpError';

interface PostPayload {
  userId: string;
  content: string;
  imageUrl: string;
  categoryId: string;
}

export class PostService {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
  }

  static async getPostById(id: string): Promise<Post | null> {
    const postRepository = getRepository(Post);
    const post = postRepository.findOne({
      where: { id },
      relations: ["user", "category", "comments"],
    });
    return post;
  }

  public async createPost(payload: PostPayload): Promise<Post> {
    const userRepository = getRepository(User);
    const categoryRepository = getRepository(Category);

    const user = await userRepository.findOne({ where: { id: payload.userId } });
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const category = await categoryRepository.findOne({ where: { id: payload.categoryId } });
    if (!category) {
      throw new HttpError(404, "Category not found");
    }

    const post = this.postRepository.create({
      content: payload.content,
      imageUrl: payload.imageUrl,
      user,
      category,
    });

    await this.postRepository.save(post);

    return post;
  }

  public async updatePost(postId: string, content: string, imageUrl: string): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    post.content = content;
    post.imageUrl = imageUrl;
    await this.postRepository.save(post);

    return post;
  }

  public async deletePost(postId: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    await this.postRepository.remove(post);
  }

  public async getAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ["user", "category", "comments"],
    });
    return posts;
  }

  public async upvotePost(postId: string): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    post.upvotes += 1;
    await this.postRepository.save(post);

    return post;
  }

  public async downvotePost(postId: string): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    post.downvotes += 1;
    await this.postRepository.save(post);

    return post;
  }

  public async addComment(postId: string, userId: string, content: string): Promise<Comment> {
    const userRepository = getRepository(User);
    const commentRepository = getRepository(Comment);

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    const comment = commentRepository.create({
      content,
      user,
      post,
    });

    await commentRepository.save(comment);

    return comment;
  }

  public async getCommentsForPost(postId: string): Promise<Comment[]> {
    const commentRepository = getRepository(Comment);
    const comments = await commentRepository.find({ where: { post: { id: postId } } });
    return comments;
  }

  public async getSortedPosts(sortBy: 'createdAt' | 'upvotes' | 'downvotes', order: 'ASC' | 'DESC'): Promise<Post[]> {
    const posts = await this.postRepository.find({ order: { [sortBy]: order } });
    return posts;
  }

  public async filterPostsByCategory(categoryId: string): Promise<Post[]> {
    const posts = await this.postRepository.find({ where: { category: { id: categoryId } } });
    return posts;
  }

  public async filterPostsByUser(userId: string): Promise<Post[]> {
    const posts = await this.postRepository.find({ where: { user: { id: userId } } });
    return posts;
  }
}
