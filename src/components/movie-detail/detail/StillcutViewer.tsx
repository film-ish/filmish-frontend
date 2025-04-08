import { useState } from 'react';
import IconButton from '../../common/IconButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StillcutViewerProps {
  stillcuts: string[];
}

const StillcutViewer = ({ stillcuts }: StillcutViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleIndexChange = (direction: 'left' | 'right') => {
    setCurrentIndex((prevIndex) => {
      if (direction === 'left') {
        return prevIndex > 0 ? prevIndex - 1 : stillcuts.length - 1;
      }
      return prevIndex < stillcuts.length - 1 ? prevIndex + 1 : 0;
    });
  };

  return (
    <div className="relative flex items-center justify-center box-content mt-[-1.5rem] aspect-[2/1] overflow-hidden">
      <IconButton onClick={() => handleIndexChange('left')} className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <ChevronLeft />
      </IconButton>
      <img className="z-0 w-full h-full object-cover" src={stillcuts[currentIndex]} alt="영화 스틸컷" />
      <IconButton onClick={() => handleIndexChange('right')} className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <ChevronRight />
      </IconButton>
    </div>
  );
};

export default StillcutViewer;
