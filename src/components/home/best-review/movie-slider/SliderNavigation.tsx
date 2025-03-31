import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderNavigationProps {
  onPrevClick: () => void;
  onNextClick: () => void;
}

const SliderNavigation = ({ onPrevClick, onNextClick }: SliderNavigationProps) => {
  return (
    <>
      <button
        onClick={onPrevClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNextClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
};

export default SliderNavigation; 