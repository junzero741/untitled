// Shared types and interfaces for the bulletin board application

export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  username: string
  createdAt: Date
}

export interface CreatePostDTO {
  title: string
  content: string
  author: string
}

export interface UpdatePostDTO {
  title?: string
  content?: string
}
