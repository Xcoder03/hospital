import { Repository } from 'typeorm';
import { Post } from '../models/post';
import { User } from '../models/user';
import { Category } from '../models/category';
import { Comment } from '../models/comment';
import { HttpError } from '../errors/HttpError';
import AppDataSource from '../data-source';

interface PostPayload {
  userId: number;
  content: string;
  imageUrl: string;
  categoryId: number;
}

export class PostService {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
  }

  static async getPostById(id: number): Promise<Post | null> {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({
      where: { id },
      relations: ["user", "category", "comments"],
    });
    return post;
  }

  public async createPost(payload: PostPayload): Promise<Post> {
    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);

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

  public async updatePost(postId: number, content: string, imageUrl: string): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    post.content = content;
    post.imageUrl = imageUrl;
    await this.postRepository.save(post);

    return post;
  }

  public async deletePost(postId: number): Promise<void> {
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

  public async upvotePost(postId: number): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    post.upvotes += 1;
    await this.postRepository.save(post);

    return post;
  }

  public async downvotePost(postId: number): Promise<Post | null> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    post.downvotes += 1;
    await this.postRepository.save(post);

    return post;
  }

  public async addComment(postId: number, userId: number, content: string): Promise<Comment> {
    const userRepository = AppDataSource.getRepository(User);
    const commentRepository = AppDataSource.getRepository(Comment);

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

  public async getCommentsForPost(postId: number): Promise<Comment[]> {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comments = await commentRepository.find({ where: { post: { id: postId } }, relations: ["user", "post"] });
    return comments;
  }

  public async getSortedPosts(sortBy: 'createdAt' | 'upvotes' | 'downvotes', order: 'ASC' | 'DESC'): Promise<Post[]> {
    const posts = await this.postRepository.find({ order: { [sortBy]: order } });
    return posts;
  }

  public async filterPostsByCategory(categoryId: number): Promise<Post[]> {
    const posts = await this.postRepository.find({ where: { category: { id: categoryId } } });
    return posts;
  }

  public async filterPostsByUser(userId: number): Promise<Post[]> {
    const posts = await this.postRepository.find({ where: { user: { id: userId } } });
    return posts;
  }
}
