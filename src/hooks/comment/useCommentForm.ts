import React, { useState } from 'react';

interface SubmitActions {
  createComment: (content: string, parentId?: number) => void;
  updateComment: (commentId: number, content: string) => void;
}

const useCommentForm = (
  initialContent?: string = '',
  commentId?: number = null,
  parentCommentId?: number = null,
  onSubmit: SubmitActions,
) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 100) return;
    setContent(e.target.value);
  };

  const resetForm = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (commentId) {
      onSubmit.updateComment(commentId, content);
      resetForm();
    } else {
      if (parentCommentId) {
        onSubmit.createComment(content, parentCommentId);
      } else {
        onSubmit.createComment(content);
      }
      resetForm();
    }
  };

  return {
    comment: content,
    setComment: handleComment,
    isEditing,
    setIsEditing,
    resetForm,
    handleSubmit,
  };
};

export default useCommentForm;
