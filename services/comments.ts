import api from './axios';

export interface CommentDTO {
  id: string;
  userId: string;
  categoryId: string;
  content: string;
  timestamp: number;
}

// GET /api/comments?categoryId=XYZ
export const fetchComments = (categoryId: string) =>
  api.get<CommentDTO[]>(`/comments`, { params: { categoryId } });

// POST /api/comments
export const postComment = (
  categoryId: string,
  userId: string,
  content: string
) =>
  api.post<{ status: string }>(`/comments`, {
    categoryId,
    userId,
    content,
  });

// DELETE /api/comments/{id}
export const deleteComment = (commentId: string) =>
  api.delete<{ status: string }>(`/comments/${commentId}`); 