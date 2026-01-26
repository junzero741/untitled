/**
 * JWT 토큰 페이로드 인터페이스
 */
export interface JwtPayload {
  sub: string;
  [key: string]: unknown;
}

/**
 * JWT 토큰을 안전하게 파싱합니다.
 * 
 * @param token - 파싱할 JWT 토큰 문자열
 * @returns 파싱된 JWT 페이로드 또는 null (파싱 실패 시)
 * 
 * @example
 * const token = localStorage.getItem('token');
 * const payload = parseJwtToken(token);
 * if (payload) {
 *   console.log('User ID:', payload.sub);
 * }
 */
export function parseJwtToken(token: string | null): JwtPayload | null {
  if (!token) {
    return null;
  }

  try {
    // JWT 토큰은 "header.payload.signature" 형식
    const parts = token.split('.');
    
    // 유효한 JWT 토큰은 3개의 부분으로 구성됨
    if (parts.length !== 3) {
      console.error('Invalid JWT token format: expected 3 parts');
      return null;
    }

    // 두 번째 부분(payload)을 base64 디코딩
    const payload = parts[1];
    
    // Base64 문자열 검증 (영문자, 숫자, +, /, = 만 허용)
    if (!/^[A-Za-z0-9+/=_-]*$/.test(payload)) {
      console.error('Invalid base64 format in JWT token payload');
      return null;
    }
    
    // base64 디코딩
    let decodedPayload: string;
    try {
      decodedPayload = atob(payload);
    } catch (error) {
      console.error('Failed to decode base64 payload:', error);
      return null;
    }
    
    // JSON 파싱
    let parsedPayload: JwtPayload;
    try {
      parsedPayload = JSON.parse(decodedPayload) as JwtPayload;
    } catch (error) {
      console.error('Failed to parse JSON payload:', error);
      return null;
    }

    // 필수 필드 검증
    if (!parsedPayload.sub) {
      console.error('Invalid JWT payload: missing "sub" field');
      return null;
    }

    return parsedPayload;
  } catch (error) {
    // 예상치 못한 에러 처리
    console.error('Unexpected error while parsing JWT token:', error);
    return null;
  }
}
