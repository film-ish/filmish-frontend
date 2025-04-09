import MovieInfo from './MovieInfo';
import SliderControls from './SliderControls';
import SliderNavigation from './SliderNavigation';

interface Movie {
  id: number;
  title: string;
  rating: number;
  stillcut: string;
}

interface MovieSliderProps {
  movies: Movie[];
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
            }`}>
            <div className="relative w-full h-full">
              <img
                src={movie.stillcut || '/no-poster.png'}
                alt={movie.title}
                className="w-full h-full object-cover rounded-xl bg-gray-6"
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '0.75rem',
                  zIndex: 5,
                }}
              />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
              <MovieInfo title={movie.title} rating={movie.rating} onDetailClick={() => handleDetailClick(movie.id)} />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2">
        <SliderControls total={movies.length} currentSlide={currentSlide} onSlideChange={onSlideChange} />
      </div>
      <div
        className="z-[30]"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'relative', height: '100%', pointerEvents: 'auto' }}>
          <SliderNavigation onPrevClick={handlePrevSlide} onNextClick={handleNextSlide} />
        </div>
      </div>
    </div>
  );
};

export default MovieSlider;
