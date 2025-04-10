import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import IconButton from '../../common/IconButton';

interface ImageViewerProps {
  images: string[];
  alt?: string;
  handleClose: () => void;
}

const ImageViewer = ({ images, alt = '이미지', handleClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (currentIndex < 0) {
      setCurrentIndex(images.length - 1);
    } else if (currentIndex >= images.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + (e.currentTarget.id === 'prev' ? -1 : 1));
    }
  };

  return (
    <div
      className="z-1000 fixed inset-0 w-screen h-screen bg-gray-8/90 flex justify-center items-center"
      onClick={handleClose}>
      {images.length > 1 && (
        <div className="fixed top-1/2 translate-y-[-50%] px-4 left-0 right-0 flex justify-between">
          <IconButton onClick={handleImageChange}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleImageChange}>
            <ChevronRight />
          </IconButton>
        </div>
      )}

      <div className="relative max-w-[90%] max-h-[90%]" onClick={(e) => e.stopPropagation()}>
        <img src={images[currentIndex]} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>
  );
};

export default ImageViewer;
