import { useState, useRef, useEffect } from 'react';
import ProfileImage from '../../common/ProfileImage';
import Button from '../../common/Button';
import { Star, StarHalf } from 'lucide-react';
import { useUserStore } from '../../../store/userStore';

interface CommentFormProps {
  onSubmit: (content: string, rating?: number) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitButtonText?: string;
  submitButtonColor?: 'rose-cloud' | 'cherry-blush';
  cancelButtonText?: string;
  className?: string;
  showRating?: boolean;
  showCancel?: boolean;
  ratingStep?: number;
  initialContent?: string;
  initialRating?: number;
  maxLength?: number;
}

const CommentForm = ({
  onSubmit,
  onCancel,
  placeholder = '작성하기',
  submitButtonText = '올리기',
  submitButtonColor = 'rose-cloud',
  cancelButtonText = '취소',
  className = '',
  showRating = false,
  showCancel = true,
  ratingStep = 1,
  initialContent = '',
  initialRating = 0,
  maxLength = 50,
}: CommentFormProps) => {
  const { headImage } = useUserStore();
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(initialContent);
    setRating(initialRating);
  }, [initialContent, initialRating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, showRating ? rating : undefined);
      (document.activeElement as HTMLElement)?.blur();
      setContent('');
      setRating(0);
      e.target.reset();
    }
  };

  const calculateRating = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!starsRef.current) return 0;

    const rect = starsRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth);
    const starPosition = (x % starWidth) / starWidth;

    if (starIndex < 0) return 0.5;
    if (starIndex >= 5) return 5;

    return starIndex + (starPosition < 0.5 ? 0.5 : 1);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    document.body.style.cursor = 'grabbing';

    setIsDragging(true);
    const initialRating = calculateRating(e);
    setHoverRating(initialRating);
  };

  const getStarColor = (value: number) => {
    const currentRating = hoverRating || rating;
    return value <= currentRating ? 'fill-rose-cloud text-rose-cloud' : 'text-gray-4';
  };

  const handleCancel = () => {
    setContent('');
    setRating(0);
    setHoverRating(0);
    setIsDragging(false);
    onCancel?.();
  };

  useEffect(() => {
    if (!isDragging) {
      document.body.style.cursor = 'default';
    }
  }, [isDragging]);

  useEffect(() => {
    const handleMouseLeave = () => {
      setHoverRating(0);
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setHoverRating(calculateRating(e));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setRating(hoverRating);
    };

    document?.addEventListener('mouseleave', handleMouseLeave);
    document?.addEventListener('mousemove', handleMouseMove);
    document?.addEventListener('mouseup', handleMouseUp);

    return () => {
      document?.removeEventListener('mouseleave', handleMouseLeave);
      document?.removeEventListener('mousemove', handleMouseMove);
      document?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > maxLength) {
      alert(`최대 ${maxLength}자까지 입력할 수 있습니다.`);
      return;
    }
    setContent(e.target.value);
  };

  return (
    <form className={`flex flex-col gap-2 ${className}`} onSubmit={handleSubmit}>
      <div className="flex gap-2 items-center">
        <ProfileImage src={headImage} />
        <div className="flex-1 flex flex-col gap-2">
          {showRating && (
            <div ref={starsRef} className="w-fit flex gap-1 cursor-pointer" onMouseDown={handleMouseDown}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="relative w-5 h-5">
                  <Star size={20} className={getStarColor(value)} />
                  {ratingStep === 0.5 && (
                    <StarHalf size={20} className={`${getStarColor(value - 0.5)} absolute top-0 left-0`} />
                  )}
                </div>
              ))}
            </div>
          )}
          <input
            className={
              'w-full border-b-[1px] focus:outline-none focus:ring-0 focus:border-b-[1px] focus:border-b-white' +
              (content ? ' border-b-white' : ' border-b-gray-4')
            }
            type="text"
            placeholder={placeholder}
            value={content}
            onChange={handleTextInputChange}
          />
        </div>
      </div>

      <div className="self-end flex gap-2">
        {showCancel && (
          <Button onClick={handleCancel} shape="rounded-full" variant="outlined">
            {cancelButtonText}
          </Button>
        )}
        <Button
          type="submit"
          bgColor={submitButtonColor}
          shape="rounded-full"
          variant="filled"
          disabled={showRating ? rating === 0 || !content.trim() : !content.trim()}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
