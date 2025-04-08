import { useRef, useState } from 'react';
import Button from '../../common/Button';
import { Camera } from 'lucide-react';

interface ReviewFormProps {
  onClickCancel?: () => void;
  createReview?: (e: React.FormEvent) => void;
  setShowReviewForm?: (show: boolean) => void;
}

const ReviewForm = ({ onClickCancel, createReview, setShowReviewForm }: ReviewFormProps) => {
  const fileInputRef = useRef();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // 높이 초기화
    textarea.style.height = textarea.scrollHeight + 'px'; // 실제 내용 높이로 설정
    setContent(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(fileInputRef.current.files);
    createReview({ title, content, images: fileInputRef.current.files });
    setTitle('');
    setContent('');
    setThumbnail(null);
    setShowReviewForm?.(false);
  };

  const validateImageLoad = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setThumbnail(img.src);
        resolve(true);
      };
      img.onerror = () => resolve(false);
    });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    Array.from(e.target.files).forEach(async (file) => {
      if (!file.type.includes('image')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        e.target.value = '';
        return;
      }

      if (file.size / (1024 * 1024) >= 5) {
        alert('5mb 이하의 파일만 업로드할 수 있습니다.');
        e.target.value = '';
        return;
      }

      if (!(await validateImageLoad(file))) {
        alert('손상된 파일입니다. 파일을 확인해주세요.');
        e.target.value = '';
        return;
      }
    });
  };

  return (
    <form className="w-full flex flex-col gap-2" onSubmit={onSubmit}>
      <div className="flex gap-2 items-start">
        <div className="relative flex items-center justify-center w-[8rem] aspect-square border-2 border-gray-2 rounded-[10px] overflow-hidden border-dashed">
          {thumbnail ? (
            <div className="w-full h-full flex items-center justify-center rounded-[10px] overflow-hidden">
              <img className="object-cover w-full h-full" src={thumbnail} alt="Review Images Thumbnail" />
            </div>
          ) : (
            <button
              className="w-full h-full flex flex-col gap-2 items-center justify-center text-label-sm"
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
              }}>
              <Camera />
              사진 넣기
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFileChange} hidden />
        </div>

        <div className="w-full flex flex-col gap-2">
          <input
            className="text-label-md border-[1px] border-gray-2 rounded-[5px] p-1"
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            onChange={onChangeTitle}
          />
          <textarea
            className="text-label-md border-[1px] border-gray-2 rounded-[5px] p-1 resize-none overflow-y-hidden"
            placeholder="내용을 입력하세요."
            value={content}
            onChange={onChangeContent}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          shape="rounded-full"
          variant="outlined"
          onClick={() => {
            onClickCancel();
          }}>
          취소
        </Button>
        <Button type="submit" shape="rounded-full" disabled={!title.trim() || !content.trim()}>
          확인
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
