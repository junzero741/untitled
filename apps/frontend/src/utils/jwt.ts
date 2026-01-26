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

    // 두 번째 부분(payload)을 base64url 디코딩
    let payload = parts[1];
    
    // Base64url 문자열 검증 (JWT는 base64url 인코딩 사용: A-Z, a-z, 0-9, -, _ 만 허용)
    if (!/^[A-Za-z0-9_-]*$/.test(payload)) {
      console.error('Invalid base64url format in JWT token payload');
      return null;
    }
    
    // base64url을 base64로 변환 (JWT는 base64url 인코딩을 사용)
    // - base64url의 '-'를 base64의 '+'로 변환
    // - base64url의 '_'를 base64의 '/'로 변환
    // - 필요한 경우 padding('=') 추가
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - payload.length % 4) % 4;
    payload = payload.padEnd(payload.length + paddingLength, '=');
    
    // base64 디코딩
    let decodedPayload: string;
    try {
      decodedPayload = atob(payload);
    } catch (error) {
      console.error('Failed to decode base64url payload:', error);
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
