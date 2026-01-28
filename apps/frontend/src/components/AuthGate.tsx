'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGateProps {
  children: ReactNode;
  /**
   * 로그인이 필요한 경우 true (기본값)
   * false인 경우 로그인하지 않은 사용자에게만 자식 요소를 보여줌
   */
  requireAuth?: boolean;
  /**
   * 조건을 만족하지 않을 때 표시할 요소 (기본값: null = 아무것도 표시 안함)
   */
  fallback?: ReactNode;
}

/**
 * 로그인 여부에 따라 자식 요소를 조건부로 렌더링하는 컴포넌트
 * 페이지 내 특정 UI (버튼, 박스, 섹션 등)에만 인증 조건을 적용할 때 사용
 * 
 * @example
 * // 로그인한 사용자만 보이는 버튼
 * <AuthGate requireAuth={true}>
 *   <button onClick={handleDelete}>삭제</button>
 * </AuthGate>
 * 
 * @example
 * // 로그인하지 않은 사용자만 보이는 링크
 * <AuthGate requireAuth={false} fallback={<span>이미 로그인됨</span>}>
 *   <a href="/login">로그인하기</a>
 * </AuthGate>
 * 
 * @example
 * // 로그인 필요 메시지와 함께
 * <AuthGate 
 *   requireAuth={true}
 *   fallback={<p className="text-sm text-gray-500">로그인이 필요합니다</p>}
 * >
 *   <div className="premium-feature">프리미엄 기능</div>
 * </AuthGate>
 */
export function AuthGate({
  children,
  requireAuth = true,
  fallback = null,
}: AuthGateProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때는 렌더링하지 않음
  if (isLoading) {
    return null;
  }

  // 로그인이 필요한데 로그인하지 않은 경우
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // 로그인하지 않아야 하는데 로그인한 경우
  if (!requireAuth && isAuthenticated) {
    return <>{fallback}</>;
  }

  // 조건을 만족하는 경우 자식 요소 렌더링
  return <>{children}</>;
}
