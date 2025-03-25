// components/genre-recommendations/GenreTagList/GenreTagList.tsx
import GenreTag from "../genre-tag";

interface GenreTagListProps {
    genres: string[];
    activeGenre: string | null;
    onGenreClick: (genre: string) => void;
}

const GenreTagList = ({ genres, activeGenre, onGenreClick }: GenreTagListProps) => {
    return (
        <div className="flex flex-wrap">
            {genres.map((genre) => (
                <GenreTag
                    key={genre}
                    genre={genre}
                    isActive={activeGenre === genre}
                    onClick={() => onGenreClick(genre)}
                />
            ))}
        </div>
    );
};

export default GenreTagList;