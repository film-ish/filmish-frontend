// components/genre-recommendations/MovieCarousel/MovieCarousel.tsx
import { useRef } from 'react';
import MovieCard from "../movie-card";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number;
    image: string;
}

interface MovieCarouselProps {
    movies: MovieProps[];
}

const MovieCarousel = ({ movies }: MovieCarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className="flex overflow-x-auto scrollbar-hide py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MovieCarousel;