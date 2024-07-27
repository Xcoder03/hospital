import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from './post';
import { Comment } from './comment';
import ExtendedBaseEntity from './ExtendedBaseEntity';
import { IsEmail } from "class-validator";

@Entity()

export class User extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ unique: true })
  username!: string;


  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  emailVerified!: boolean;



  @Column()
  password!: string;



  @OneToMany(() => Post, post => post.user)
  posts!: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
