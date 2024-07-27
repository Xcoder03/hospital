import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user';
import { Comment } from './comment';
import { Category } from './category';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column()
  image!: string;

  @ManyToOne(() => User, user => user.posts)
  user!: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments!: Comment[];

  @ManyToOne(() => Category, category => category.posts)
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
