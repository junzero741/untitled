import { Post } from '@bulletin-board/shared'

/**
 * 게시글 목록 응답 타입
 */
export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
}
