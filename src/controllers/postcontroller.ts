import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/postServices";
import { HttpError } from "../errors/HttpError";

class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postService.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostService.getPostById(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postService.updatePost(parseInt(req.params.id), req.body.content, req.body.imageUrl);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      await this.postService.deletePost(parseInt(req.params.id));
      res.status(202).json({ message: "Post deleted successfully" });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async upvotePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postService.upvotePost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async downvotePost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postService.downvotePost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await this.postService.addComment(parseInt(req.params.postId), req.body.userId, req.body.content);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getCommentsForPost(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await this.postService.getCommentsForPost(parseInt(req.params.postId));
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

   async getSortedPosts(req: Request, res: Response) {
    try {
      const sortBy = req.query.sortBy as 'createdAt' | 'upvotes' | 'downvotes';
      const order = req.query.order as 'ASC' | 'DESC';
      const posts = await new PostService().getSortedPosts(sortBy, order);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error sorting posts', error });
    }
  }

  async filterPostsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await this.postService.filterPostsByCategory(parseInt(req.params.categoryId));
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async filterPostsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await this.postService.filterPostsByUser(parseInt(req.params.userId));
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export { PostController };
