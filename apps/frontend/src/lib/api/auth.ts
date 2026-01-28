/**
 * 인증 관련 API 함수들
 */

import { apiClient } from './client';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from './types';

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/auth/login', data);
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return apiClient.post<SignupResponse>('/auth/signup', data);
}

export const authApi = {
  login,
  signup,
};
