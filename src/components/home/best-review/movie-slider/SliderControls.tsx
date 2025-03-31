interface SliderControlsProps {
  total: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

const SliderControls = ({ total, currentSlide, onSlideChange }: SliderControlsProps) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentSlide === index ? 'bg-white w-6' : 'bg-gray-6 hover:bg-gray-5'
          }`}
          onClick={() => onSlideChange(index)}
        />
      ))}
    </div>
  );
};

export default SliderControls; 