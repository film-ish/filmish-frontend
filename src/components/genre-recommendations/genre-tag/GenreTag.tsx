// components/genre-recommendations/GenreTag/GenreTag.tsx
interface GenreTagProps {
    genre: string;
    isActive?: boolean;
    onClick?: () => void;
}

// GenreTag.tsx 수정
const GenreTag = ({ genre, isActive = false, onClick }: GenreTagProps) => {
    return (
        <button
            className={`px-2 py-1 rounded-full text-xs mr-1 mb-1 ${
                isActive
                    ? 'bg-gray-7 text-white'
                    : 'bg-gray-1 text-gray-6'
            }`}
            onClick={onClick}
        >
            #{genre}
        </button>
    );
};

export default GenreTag;