'use client';

import { withAuth } from '@/components/HOC';
import { AuthGate } from '@/components/HOC';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

/**
 * 로그인한 사용자만 볼 수 있는 프로필 페이지 예제
 * withAuth HOC로 래핑되어 있어 로그인하지 않은 사용자는 접근할 수 없음
 */
function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">내 프로필</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사용자 ID
            </label>
            <div className="p-3 bg-gray-50 rounded-md">
              {user?.id}
            </div>
          </div>

          {user?.email && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {user.email}
              </div>
            </div>
          )}

          {user?.username && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사용자명
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {user.username}
              </div>
            </div>
          )}

          {/* AuthGate 사용 예제: 로그인한 사용자만 이 버튼들을 볼 수 있음 */}
          <div className="pt-4 space-y-3">
            <AuthGate
              requireAuth={true}
              fallback={<p className="text-sm text-gray-500">프로필 수정 권한이 없습니다</p>}
            >
              <Link
                href="/profile/edit"
                className="block w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
              >
                프로필 수정
              </Link>
            </AuthGate>

            <button
              onClick={logout}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// withAuth HOC를 사용하여 로그인한 사용자만 접근 가능하도록 설정
export default withAuth(ProfilePage, {
  requireAuth: true,
});
