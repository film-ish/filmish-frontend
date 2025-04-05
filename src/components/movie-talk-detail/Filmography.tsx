import { useRef } from 'react';
import { useDraggable } from '../../hooks/useDraggable';

interface FilmographyItem {
  title: string;
  date: string;
  posterUrl?: string;
}

interface FilmographyProps {
  items: FilmographyItem[];
}

const Filmography = ({ items }: FilmographyProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = useDraggable(scrollerRef);

  return (
    <div className="flex flex-col px-8 py-4 bg-white/10 rounded-lg backdrop-blur-xl content-center">
      <h3 className="text-xl font-bold tracking-wider mb-4">FILMOGRAPHY</h3>
      <div 
        ref={scrollerRef}
        className="overflow-x-auto"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex gap-4 min-w-max pb-4">
          {items.map((film, index) => (
            <div key={index} className="w-30 flex-[0_0_auto] aspect-[3/4] bg-gray-7 rounded-lg overflow-hidden">
              <div className="w-full h-full relative group cursor-pointer">
                {film.posterUrl && (
                  <img src={film.posterUrl} alt={film.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-lg font-bold text-white">{film.title}</p>
                  <p className="text-xs font-light text-gray-5">{film.date}</p>
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