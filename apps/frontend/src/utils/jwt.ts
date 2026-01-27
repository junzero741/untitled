/**
 * JWT 토큰 페이로드 인터페이스
 */
export interface JwtPayload {
  sub: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * 
 * @param payload - JWT 페이로드
 * @returns 토큰이 만료되었으면 true, 아니면 false
 */
export function isTokenExpired(payload: JwtPayload): boolean {
  if (!payload.exp) {
    // exp 클레임이 없으면 만료되지 않은 것으로 간주
    return false;
  }
  
  // exp는 초 단위 타임스탬프이므로 1000을 곱하여 밀리초로 변환
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  return currentTime >= expirationTime;
}

/**
 * JWT 토큰을 안전하게 파싱하고 유효성을 검증합니다.
 * 
 * @param token - 파싱할 JWT 토큰 문자열
 * @returns 파싱된 JWT 페이로드 또는 null (파싱 실패 시 또는 만료된 경우)
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
    let payloadBase64url = parts[1];
    
    // Base64url 문자열 검증 (JWT는 base64url 인코딩 사용: A-Z, a-z, 0-9, -, _ 만 허용)
    if (!/^[A-Za-z0-9_-]*$/.test(payloadBase64url)) {
      console.error('Invalid base64url format in JWT token payload');
      return null;
    }
    
    // base64url을 base64로 변환 (JWT는 base64url 인코딩을 사용)
    // - base64url의 '-'를 base64의 '+'로 변환
    // - base64url의 '_'를 base64의 '/'로 변환
    // - 필요한 경우 padding('=') 추가
    payloadBase64url = payloadBase64url.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - payloadBase64url.length % 4) % 4;
    const payloadBase64 = payloadBase64url.padEnd(payloadBase64url.length + paddingLength, '=');
    
    // base64 디코딩
    let decodedPayload: string;
    try {
      decodedPayload = atob(payloadBase64);
    } catch (error) {
      console.error('Failed to decode base64url payload:', error);
      return null;
    }
    
    // JSON 파싱
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to parse JSON payload:', error);
      return null;
    }

    // 타입 가드: 파싱된 객체가 유효한 JWT 페이로드인지 확인
    if (
      !parsedData ||
      typeof parsedData !== 'object' ||
      !('sub' in parsedData)
    ) {
      console.error('Invalid JWT payload structure');
      return null;
    }

    const payload = parsedData as JwtPayload;

    // 필수 필드 검증: sub는 존재하고 빈 문자열이 아니어야 함
    if (typeof payload.sub !== 'string' || payload.sub.trim() === '') {
      console.error('Invalid JWT payload: "sub" field must be a non-empty string');
      return null;
    }

    // 토큰 만료 검증
    if (isTokenExpired(payload)) {
      console.error('JWT token has expired');
      return null;
    }

    return payload;
  } catch (error) {
    // 예상치 못한 에러 처리
    console.error('Unexpected error while parsing JWT token:', error);
    return null;
  }
}
