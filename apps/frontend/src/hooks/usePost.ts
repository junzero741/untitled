'use client';

import { useEffect, useState } from 'react';
import { Post } from '@bulletin-board/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface UsePostResult {
  post: Post | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 게시글 상세 정보를 불러오는 커스텀 훅
 * @param postId - 게시글 ID
 * @returns 게시글 데이터, 로딩/에러 상태, 새로고침 함수
 */
export function usePost(postId: string): UsePostResult {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

      if (!response.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }

      const data: Post = await response.json();
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return {
    post,
    isLoading,
    error,
    refetch: fetchPost,
  };
}
