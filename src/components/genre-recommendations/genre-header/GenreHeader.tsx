// components/genre-recommendations/GenreHeader/GenreHeader.tsx
import GenreTagList from "../genre-tag-list";

interface GenreHeaderProps {
    genres: string[];
    activeGenre: string | null;
    onGenreClick: (genre: string) => void;
}

const GenreHeader = ({ genres, activeGenre, onGenreClick }: GenreHeaderProps) => {
    return (
        <div className="px-4 pt-4 pb-2">
            <h1 className="text-xl font-bold mb-2">장르별 추천</h1>
            <GenreTagList
                genres={genres}
                activeGenre={activeGenre}
                onGenreClick={onGenreClick}
            />
        </div>
    );
};

export default GenreHeader;