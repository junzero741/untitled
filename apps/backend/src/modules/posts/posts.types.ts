import { Post } from '../../entities/post.entity'

/**
 * 게시글 목록 응답 타입
 */
export interface PostListResponse {
  data: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
}
