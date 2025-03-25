// components/genre-recommendations/MovieCard/MovieCard.tsx
interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number;
    image: string;
}

interface MovieCardProps {
    movie: MovieProps;
}

const MovieCard = ({ movie }: MovieCardProps) => {
    const { title, year, month, rating, image } = movie;

    return (
        <div className="relative w-32 mr-3 flex-shrink-0">
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="rounded w-full h-44 object-cover"
                />
                <button className="absolute top-2 right-2 bg-black/30 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
            <div className="mt-2">
                <h3 className="text-sm font-medium truncate">{title}</h3>
                <div className="flex items-center text-xs text-gray-5">
                    <span>{year} • {month}</span>
                    <div className="flex items-center ml-1">
                        <span className="text-yellow-400 mr-0.5">★</span>
                        <span>{rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;