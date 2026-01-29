/**
 * 게시글 관련 API 함수들
 */

import { apiClient } from './client';
import {
  GetPostsRequest,
  GetPostsResponse,
  CreatePostRequest,
  UpdatePostRequest,
  Post,
} from './types';

/**
 * 게시글 목록 조회
 */
export async function getPosts(params: GetPostsRequest = {}): Promise<GetPostsResponse> {
  const { page = 1, limit = 10 } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  return apiClient.get<GetPostsResponse>(`/posts?${queryParams}`);
}

/**
 * 게시글 상세 조회
 */
export async function getPost(id: string): Promise<Post> {
  return apiClient.get<Post>(`/posts/${id}`);
}

/**
 * 게시글 작성
 */
export async function createPost(
  data: CreatePostRequest,
  token: string
): Promise<Post> {
  return apiClient.post<Post>('/posts', data, token);
}

/**
 * 게시글 수정
 */
export async function updatePost(
  id: string,
  data: UpdatePostRequest,
  token: string
): Promise<Post> {
  return apiClient.patch<Post>(`/posts/${id}`, data, token);
}

/**
 * 게시글 삭제
 */
export async function deletePost(id: string, token: string): Promise<void> {
  return apiClient.delete<void>(`/posts/${id}`, token);
}

export const postsApi = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
