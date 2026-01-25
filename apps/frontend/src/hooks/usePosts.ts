'use client';

import { useEffect, useState } from 'react';
import { PostsListResponse } from '@bulletin-board/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface UsePostsOptions {
  page?: number;
  limit?: number;
}

interface UsePostsResult {
  posts: PostsListResponse['posts'];
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
}

/**
 * 게시글 목록 데이터를 불러오는 커스텀 훅
 * @param options - page, limit 설정 가능
 * @returns 게시글 목록, 페이지네이션 정보, 로딩/에러 상태
 */
export function usePosts(options: UsePostsOptions = {}): UsePostsResult {
  const { page: initialPage = 1, limit = 10 } = options;
  
  const [posts, setPosts] = useState<PostsListResponse['posts']>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_BASE_URL}/posts`);
        url.searchParams.set('page', String(page));
        url.searchParams.set('limit', String(limit));

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error('게시글 목록을 불러오는데 실패했습니다.');
        }

        const data: PostsListResponse = await response.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : '게시글 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit]);

  return {
    posts,
    totalPages,
    totalCount,
    isLoading,
    error,
    page,
    setPage,
  };
}
