// API request/response types

export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface PostsListResponse {
  posts: Post[];
  totalPages: number;
  totalCount: number;
  page: number;
  limit: number;
}

export interface PostDetailResponse extends Post {}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
