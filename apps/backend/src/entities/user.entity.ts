import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Post } from './post.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string

  // Stores the user's password as a securely hashed value (e.g. bcrypt), never in plain text.
  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Stores the user password as a hashed value (e.g. bcrypt), not plain text',
  })
  password: string

  @Column({ type: 'text', nullable: true })
  bio: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]
}
