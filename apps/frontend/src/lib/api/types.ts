/**
 * API 관련 타입 정의
 */

import { Post, User } from '@bulletin-board/shared';

// Auth API 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  bio?: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  username: string;
  bio?: string;
  createdAt: string;
}

// Posts API 타입
export interface GetPostsRequest {
  page?: number;
  limit?: number;
}

export interface GetPostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

// 타입 export
export type { Post, User } from '@bulletin-board/shared';
