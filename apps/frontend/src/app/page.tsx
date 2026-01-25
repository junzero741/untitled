import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">웹 기반 게시판</h1>
        <p className="text-xl text-gray-600">WYSIWYG 에디터를 탑재한 게시판</p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/posts"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            게시판 둘러보기
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            로그인
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Next.js 14 + Nest.js + PostgreSQL + ProseMirror</p>
        </div>
      </div>
    </main>
  );
}
