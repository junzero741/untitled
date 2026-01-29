'use client';

import { ComponentType } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WithAuthOptions {
  /**
   * 로그인이 필요한 컴포넌트인 경우 true (기본값)
   * false인 경우 로그인되지 않은 사용자에게만 컴포넌트를 보여줌
   */
  requireAuth?: boolean;
  /**
   * 로딩 중일 때 표시할 컴포넌트
   */
  LoadingComponent?: ComponentType;
  /**
   * 인증 실패 시 표시할 컴포넌트 (로그인 필요 시 로그인하지 않은 경우)
   */
  FallbackComponent?: ComponentType;
}

/**
 * 로그인 여부에 따라 다른 UI를 보여주는 HOC
 * 
 * @example
 * // 로그인한 사용자만 접근 가능한 페이지
 * export default withAuth(MyProfilePage, { requireAuth: true });
 * 
 * @example
 * // 로그인하지 않은 사용자만 접근 가능한 페이지 (로그인/회원가입 페이지)
 * export default withAuth(LoginPage, { requireAuth: false });
 * 
 * @example
 * // 커스텀 로딩 및 Fallback 컴포넌트 사용
 * export default withAuth(MyPage, {
 *   requireAuth: true,
 *   LoadingComponent: MyLoadingSpinner,
 *   FallbackComponent: LoginRequired,
 * });
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    LoadingComponent = DefaultLoadingComponent,
    FallbackComponent = requireAuth ? DefaultLoginRequired : DefaultAlreadyLoggedIn,
  } = options;

  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    // 로딩 중일 때
    if (isLoading) {
      return <LoadingComponent />;
    }

    // 로그인이 필요한 페이지인데 로그인하지 않은 경우
    if (requireAuth && !isAuthenticated) {
      return <FallbackComponent />;
    }

    // 로그인하지 않아야 하는 페이지인데 로그인한 경우
    if (!requireAuth && isAuthenticated) {
      return <FallbackComponent />;
    }

    // 조건을 만족하는 경우 원래 컴포넌트 렌더링
    return <Component {...props} />;
  };
}

/**
 * 기본 로딩 컴포넌트
 */
function DefaultLoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

/**
 * 로그인이 필요한 경우 표시되는 기본 컴포넌트
 */
function DefaultLoginRequired() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">로그인이 필요합니다</h2>
        <p className="text-gray-600 mb-6">
          이 페이지에 접근하려면 로그인이 필요합니다.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          로그인하기
        </a>
      </div>
    </div>
  );
}

/**
 * 이미 로그인한 사용자가 접근할 수 없는 페이지에 접근한 경우 표시되는 기본 컴포넌트
 */
function DefaultAlreadyLoggedIn() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">이미 로그인되어 있습니다</h2>
        <p className="text-gray-600 mb-6">
          로그인된 사용자는 이 페이지에 접근할 수 없습니다.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          홈으로 이동
        </a>
      </div>
    </div>
  );
}
