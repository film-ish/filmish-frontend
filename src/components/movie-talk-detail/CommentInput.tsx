import { useState } from 'react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

const CommentInput = ({ onSubmit, placeholder = "댓글을 입력하세요" }: CommentInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-2 bg-gray-700 rounded-l-md text-white"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
      >
        등록
      </button>
    </form>
  );
};

export default CommentInput;
