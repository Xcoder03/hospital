import { Repository } from 'typeorm';
import { User } from '../models/user';
import AppDataSource from '../data-source';
import { HttpError } from '../errors/HttpError';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
const otpSecret = process.env.OTP_SECRET || 'your_otp_secret';

interface UserPayload {
  username: string;
  password: string;
  email: string;
}

interface OTPPayload {
  email: string;
  otp: string;
}

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async registerUser(payload: UserPayload): Promise<User> {
    const user = this.userRepository.create(payload);
    user.emailVerified = false;
    await this.userRepository.save(user);

    // Send OTP for email verification
    await this.sendVerificationEmail(user.email);

    return user;
  }

  public async loginUser(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    if (user.password !== password) {
      throw new HttpError(401, 'Invalid password');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    return token;
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  public async sendVerificationEmail(email: string): Promise<void> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const hash = crypto.createHmac('sha256', otpSecret).update(otp).digest('hex');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Your OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      user.otp = hash;
      await this.userRepository.save(user);
    }
  }

  public async verifyEmail(payload: OTPPayload): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: payload.email } });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const hash = crypto.createHmac('sha256', otpSecret).update(payload.otp).digest('hex');
    if (user.otp !== hash) {
      throw new HttpError(401, 'Invalid OTP');
    }

    user.emailVerified = true;
    user.otp = null;
    await this.userRepository.save(user);
  }
}
