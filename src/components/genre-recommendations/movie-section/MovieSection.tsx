// components/genre-recommendations/MovieSection/MovieSection.tsx
import SectionHeader from "../section-header";
import MovieCarousel from "../movie-carousel";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number;
    image: string;
}

interface MovieSectionProps {
    title: string;
    moviesData: MovieProps[];
    isActive?: boolean;
}

const MovieSection = ({ title, moviesData, isActive = false }: MovieSectionProps) => {
    return (
        <section className={`mb-6 ${isActive ? 'bg-gray-8 -mx-4 px-4 py-2 rounded-lg' : ''}`}>
            <SectionHeader title={title} />
            <MovieCarousel movies={moviesData} />
        </section>
    );
};

export default MovieSection;