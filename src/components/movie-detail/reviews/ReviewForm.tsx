import { useEffect, useRef, useState } from 'react';
import Button from '../../common/Button';
import { Camera, X } from 'lucide-react';

interface ReviewFormProps {
  onClickCancel?: () => void;
  createReview?: (e: React.FormEvent) => void;
  setShowReviewForm?: (show: boolean) => void;
}

const ReviewForm = ({ onClickCancel, createReview, setShowReviewForm }: ReviewFormProps) => {
  const fileInputRef = useRef();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const onChangeTitle = (e) => {
    if (e.target.value.length > 20) {
      alert('제목은 20자 이내로 작성해주세요.');
      return;
    }

    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    if (e.target.value.length > 255) {
      alert('내용은 255자 이내로 작성해주세요.');
      return;
    }

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
    setImages([]);
    setShowReviewForm?.(false);
  };

  const validateImageLoad = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => resolve(false);
    });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (images.length + e.target.files.length > 3) {
      alert('이미지는 최대 3개까지만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    Array.from(e.target.files).forEach(async (file) => {
      if (images.some((existingFile) => existingFile.name === file.name)) return;

      if (!file.type.includes('image')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        e.target.value = '';
        return;
      }

      if (file.size / (1024 * 1024) >= 1) {
        alert('1MB 이하의 파일만 업로드할 수 있습니다.');
        e.target.value = '';
        return;
      }

      if (!(await validateImageLoad(file))) {
        if (confirm('손상된 파일입니다. 파일을 확인해주세요.')) {
          alert(file.name);
          e.target.value = '';
          return;
        }
      }

      setImages((prevImages) => [...prevImages, file]);
    });
  };

  useEffect(() => {
    console.log(images);
  }, [images]);

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex gap-2 items-start">
        <div className="w-full flex flex-col gap-2">
          <input
            className="text-label-md border-[1px] border-gray-2 rounded-[5px] p-1"
            type="text"
            placeholder="제목을 입력하세요. (최대 20자)"
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
            placeholder="내용을 입력하세요. (최대 255자)"
            value={content}
            onChange={onChangeContent}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex items-center justify-center w-[8rem] aspect-square border-2 border-gray-2 rounded-[10px] overflow-hidden border-dashed">
          <button
            className="w-full h-full flex flex-col gap-2 items-center justify-center text-label-sm disabled:!cursor-not-allowed"
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            disabled={images.length >= 3}>
            {images.length < 3 ? (
              <>
                <Camera />
                사진 넣기
              </>
            ) : (
              <div className="p-1 text-label-sm">최대 3장까지 업로드할 수 있습니다</div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            multiple
            onChange={onFileChange}
            hidden
          />
        </div>

        {images.map((image, index) => {
          return (
            <div
              key={index + image.name}
              className="relative w-[8rem] aspect-square border-[1px] border-gray-2 rounded-[10px]">
              <div className="relative w-[8rem] aspect-square border-[1px] border-gray-2 rounded-[10px] overflow-hidden">
                <img src={URL.createObjectURL(image)} alt="Review Images" className="object-cover w-full h-full" />
              </div>

              <button
                type="button"
                className="absolute -top-1 -right-1 bg-gray-7 rounded-full p-[6px] hover:bg-gray-8 transition-colors duration-200"
                onClick={() => {
                  setImages(images.filter((_, i) => i !== index));
                }}>
                <X size={18} stroke="#ffffff" strokeWidth={2.5} />
              </button>
            </div>
          );
        })}
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
