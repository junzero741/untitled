/**
 * API 클라이언트 설정
 * fetch를 래핑하여 공통적인 설정과 에러 처리를 제공
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export class ApiClientError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * API 요청을 위한 fetch 래퍼 함수
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 추가 헤더 병합
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        requestHeaders[key] = value;
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        requestHeaders[key] = value;
      });
    } else {
      Object.assign(requestHeaders, headers);
    }
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    // 204 No Content의 경우 본문이 없으므로 바로 반환
    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError(
        data.message || '요청 처리 중 오류가 발생했습니다.',
        response.status
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new ApiClientError(error.message);
    }

    throw new ApiClientError('알 수 없는 오류가 발생했습니다.');
  }
}

/**
 * GET 요청
 */
export async function get<T>(
  endpoint: string,
  token?: string
): Promise<T> {
  return request<T>(endpoint, { method: 'GET', token });
}

/**
 * POST 요청
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  token?: string
): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    token,
  });
}

/**
 * PATCH 요청
 */
export async function patch<T>(
  endpoint: string,
  data: unknown,
  token?: string
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * DELETE 요청
 */
export async function del<T>(
  endpoint: string,
  token?: string
): Promise<T> {
  return request<T>(endpoint, {
    method: 'DELETE',
    token,
  });
}

export const apiClient = {
  get,
  post,
  patch,
  delete: del,
};
