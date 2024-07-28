import { Request, Response, NextFunction } from "express";
import { validate } from "uuid";
import { UserService } from "../services/userServices";
import { HttpError } from "../errors/HttpError";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const token = await this.userService.loginUser(username, password);
      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getUserProfile(req: Request & { user?: any }, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({ error: "Unauthorized! No ID provided" });
      }

      if (!validate(id)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.verifyEmail(req.body);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async sendVerificationEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await this.userService.sendVerificationEmail(email);
      res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }




}

export { UserController };
