import { useRef } from 'react';
import { useDraggable } from '../../hooks/useDraggable';
import { Film } from 'lucide-react';

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
              <div className="w-full h-full relative group cursor-pointer transition-transform duration-300 hover:scale-105">
                {film.poster ? (
                  <img 
                    src={film.poster.replace('http://', 'https://') || '/no-poster.png'} 
                    alt={film.movieName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/no-poster.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-7">
                    <Film className="w-8 h-8 text-gray-5" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-sm font-bold text-white text-center line-clamp-2 mb-1">{film.movieName}</p>
                  <p className="text-xs font-light text-gray-4">{film.pubDate?.slice(0, 4) || ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filmography; 