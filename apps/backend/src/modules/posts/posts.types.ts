/**
 * 게시글 목록 응답 타입
 */
export interface PostListResponse {
  data: any[]
  total: number
  page: number
  limit: number
  totalPages: number
}
