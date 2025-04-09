import { useRef } from 'react';
import { useDraggable } from '../../hooks/useDraggable';
import { Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FilmographyItem {
  movieName: string;
  movieId: number;
  pubDate?: string;
  poster?: string;
  stillCut?: string;
}

interface FilmographyProps {
  items?: FilmographyItem[];
}

const Filmography = ({ items = [] }: FilmographyProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = useDraggable(scrollerRef);

  const navigate = useNavigate();

  const handleFilmClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="flex flex-col px-8 py-6 bg-white/10 rounded-2xl backdrop-blur-xs">
      <div className="flex items-center gap-3 mb-6">
        <Film className="w-5 h-5 text-gray-4" />
        <h3 className="text-xl font-bold tracking-wider text-white">FILMOGRAPHY</h3>
      </div>
      <div 
        ref={scrollerRef}
        className="overflow-x-auto scrollbar-hide"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex gap-4 min-w-max pb-4">
          {items.map((film, index) => (
            <div key={index} className="w-32 flex-[0_0_auto] aspect-[3/4] bg-gray-7 rounded-xl overflow-hidden shadow-lg">
              <div 
                onClick={() => handleFilmClick(film.movieId)} 
                className="w-full h-full relative cursor-pointer transition-all duration-300 hover:scale-105"
              >
                {film.poster ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={film.poster || '/no-poster.png'} 
                      alt={film.movieName} 
                      className="w-full h-full object-cover transition-all duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/no-poster.png';
                      }}
                    />
                    <div className="absolute inset-0 hover:bg-gray-8/80 transition-all duration-300">
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 opacity-0 hover:opacity-100 transition-all duration-300">
                        <p className="text-sm font-bold text-white text-center line-clamp-2">{film.movieName}</p>
                        <p className="text-xs font-light text-gray-4 mt-1">{film.pubDate?.slice(0, 4) || ''}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-7">
                    <Film className="w-8 h-8 text-gray-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filmography; 