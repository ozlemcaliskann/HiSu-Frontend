import { useState, useEffect, useCallback } from 'react';
import { fetchComments, postComment, deleteComment } from '../../services/comments';
import { auth } from '@/constants/firebase';

export interface Comment {
  id: string;
  userId: string;
  categoryId: string;
  content: string;
  timestamp: number;
}

export default function useComments(categoryId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const userId = auth.currentUser?.uid!;

  const refresh = useCallback(async () => {
    if (!categoryId) return;
    try {
      const res = await fetchComments(categoryId);
      setComments(res.data);
    } catch (e) {
      console.error('Yorumlar yüklenirken hata:', e);
    }
  }, [categoryId]);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (content: string) => {
    if (!content.trim()) return;
    await postComment(categoryId, userId, content.trim());
    await refresh();
  };

  const remove = async (id: string) => {
    await deleteComment(id);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  return { comments, add, remove };
} 