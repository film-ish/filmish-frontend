// routes/pages/GenreRecommendations/GenreRecommendations.tsx
import { useState, useEffect, useRef } from "react";
import GenreHeader from "../../components/genre-recommendations/genre-header";
import MovieSection from "../../components/genre-recommendations/movie-section";

interface MovieProps {
    id: number;
    title: string;
    year: string;
    month: string;
    rating: number | string;
    image: string;
}

// 모든 장르 목록
const allGenres = [
    "공포", "로맨스", "스포츠", "판타지", "공상", "범죄", "액션", "한국 드라마", "코미디", "스릴러", "애니", "SF", "전쟁"
];

// 각 장르별 영화 데이터 생성 함수
// 생성 함수에 반환 타입 추가
const generateMoviesForGenre = (genre: string): MovieProps[] => {
    const movies: MovieProps[] = [];
    for (let i = 1; i <= 10; i++) {
        movies.push({
            id: i,
            title: `${genre} 영화 ${i}`,
            year: '2024',
            month: '5월',
            rating: Number((4 + Math.random()).toFixed(1)),
            image: `https://picsum.photos/seed/${genre}${i}/200/300`
        });
    }
    return movies;
};

// 각 장르별 영화 데이터 생성
const genreMoviesMap = allGenres.reduce((acc, genre) => {
    acc[genre] = generateMoviesForGenre(genre);
    return acc;
}, {} as Record<string, MovieProps[]>);

const GenreRecommendations = () => {
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // 장르 클릭 핸들러
    const handleGenreClick = (genre: string) => {
        setActiveGenre(prev => prev === genre ? null : genre);
    };

    // 활성화된 장르가 변경되면 해당 섹션으로 스크롤
    useEffect(() => {
        if (activeGenre && sectionRefs.current[activeGenre]) {
            sectionRefs.current[activeGenre]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeGenre]);

    // 장르 순서 정렬 - 활성화된 장르를 맨 앞으로
    const sortedGenres = [...allGenres].sort((a, b) => {
        if (a === activeGenre) return -1;
        if (b === activeGenre) return 1;
        return 0;
    });

    return (
        <div className="pb-16 bg-black text-white">
            <GenreHeader
                genres={allGenres}
                activeGenre={activeGenre}
                onGenreClick={handleGenreClick}
            />

            <div className="px-4">
                {sortedGenres.map(genre => (
                    <div
                        key={genre}
                        ref={el => {
                            sectionRefs.current[genre] = el;
                        }}
                    >
                        <MovieSection
                            title={genre}
                            moviesData={genreMoviesMap[genre]}
                            isActive={genre === activeGenre}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenreRecommendations;