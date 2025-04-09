import { useState } from 'react';
import { Send } from 'lucide-react';
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
        className="flex-1 py-2 px-3 bg-gray-6 rounded-xl text-white text-sm"
        required
      />
      <button
        type="submit"
        className="p-2 mx-2 bg-gray-5 text-white rounded-full hover:bg-gray-6 transition"
      >
        <Send size={16} />
      </button>
    </form>
  );
};

export default CommentInput;
