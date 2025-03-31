import MovieInfo from './MovieInfo';
import SliderControls from './SliderControls';
import SliderNavigation from './SliderNavigation';

interface MovieData {
  id: number;
  title: string;
  rating: number;
  posterUrl: string;
}

interface MovieSliderProps {
  movies: MovieData[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

const MovieSlider = ({ movies, currentSlide, onSlideChange }: MovieSliderProps) => {
  const handlePrevSlide = () => {
    onSlideChange(currentSlide === 0 ? movies.length - 1 : currentSlide - 1);
  };

  const handleNextSlide = () => {
    onSlideChange(currentSlide === movies.length - 1 ? 0 : currentSlide + 1);
  };

  const handleDetailClick = (movieId: number) => {
    // TODO: Implement detail view navigation
    console.log('View details for movie:', movieId);
  };

  return (
    <div className="relative h-full">
      <div className="relative h-full overflow-hidden">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute w-full h-full transition-all duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover rounded-xl bg-gray-5"
            />
            <MovieInfo
              title={movie.title}
              rating={movie.rating}
              onDetailClick={() => handleDetailClick(movie.id)}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2">
        <SliderControls
          total={movies.length}
          currentSlide={currentSlide}
          onSlideChange={onSlideChange}
        />
      </div>
      <SliderNavigation
        onPrevClick={handlePrevSlide}
        onNextClick={handleNextSlide}
      />
    </div>
  );
};

export default MovieSlider; 