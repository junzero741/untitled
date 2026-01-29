/**
 * API 모듈 진입점
 * 모든 API 함수들을 하나의 객체로 export
 */

export * from './client';
export * from './types';
export { authApi } from './auth';
export { postsApi } from './posts';

// 편의를 위한 통합 export
import { authApi } from './auth';
import { postsApi } from './posts';

export const api = {
  auth: authApi,
  posts: postsApi,
};
