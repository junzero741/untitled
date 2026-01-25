/**
 * 게시글 생성 요청 타입
 */
export interface CreatePostRequest {
  title: string
  content: string
}

/**
 * 게시글 수정 요청 타입
 */
export interface UpdatePostRequest {
  title: string
  content: string
}

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
