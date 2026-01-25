// Shared types and interfaces for the bulletin board application

export * from './api.types'

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

// Auth Types
export interface SignUpRequest {
  email: string
  username: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    username: string
  }
}

export interface JwtPayload {
  sub: string
  email: string
  username: string
}
