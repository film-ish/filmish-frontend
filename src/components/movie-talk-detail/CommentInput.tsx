import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder: string;
}

const CommentInput = ({ onSubmit, placeholder }: CommentInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (content.length > 100) {
      alert('댓글/답글은 100자 이하로 입력해주세요.');
      return;
    }
    onSubmit(content);
    setContent('');
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full flex-grow px-3 py-2 text-sm bg-gray-8/50 rounded-xl border border-gray-7/50 focus:border-gray-5 focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <button
        onClick={handleSubmit}
        className="p-2 bg-gray-6 text-white rounded-full hover:bg-white hover:text-cherry-blush"
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default CommentInput;
