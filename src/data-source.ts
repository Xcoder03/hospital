// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './models/user';
import { Post } from './models/post';
import { Comment } from './models/comment';
import { Category } from './models/category';
import dotenv from 'dotenv';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username:  process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post, Comment, Category],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
