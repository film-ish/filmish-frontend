import { useState } from 'react';
import ReviewCard from './review-card/ReviewCard';
import MovieSlider from './movie-slider/MovieSlider';
import { ChevronDown } from 'lucide-react';

interface ReviewData {
  id: number;
  title: string;
  content: string;
  date: string;
  rating: number;
  username: string;
}

interface MovieData {
  id: number;
  title: string;
  rating: number;
  posterUrl: string;
}

const BestReview = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExploreMode, setIsExploreMode] = useState(false);
  
  const reviews: ReviewData[] = [
    {
      id: 1,
      title: "세이디 싱크 '스파이더맨 4' 제스처, 전 그래야만 했달",
      content: "In theaters on July 21, 2025, 단체 촬영시 나온 제스처 설명과 함께 SPIDER-MAN 촬영 뒷 이야기를...",
      date: "2025.03.12",
      rating: 4.8,
      username: "마법의 동구리미"
    },
    {
      id: 2,
      title: "세이디 싱크 '스파이더맨 4' 제스처,...",
      content: "Sadie Sink has been cast in 'SPIDER-MAN 4'. The young actress, known for her role in Stranger Things, will join the Marvel Cinematic Universe in the upcoming Spider-Man sequel. Fans are excited to see how her character will fit into the story.",
      date: "2025.03.12",
      rating: 4.8,
      username: "마법의 동구리미"
    },
    {
      id: 3,
      title: "연상호 X 정도련 감독 X 이병헌, 넷플릭스 오리지널...",
      content: "감독도 주연배우도 아직 안 정했는데...? 영화를 좋아한다면 놓칠 수 없는 만남! 연상호 X 정도련 감독 X 이병헌, 넷플릭스 영화 <제시옥>을 더 깊이...",
      date: "2025.03.12",
      rating: 4.8,
      username: "마법의 동구리미"
    }
  ];

  const movies: MovieData[] = [
    {
      id: 1,
      title: "해야 할 일",
      rating: 4.8,
      posterUrl: "/images/movie1.jpg"
    },
    {
      id: 2,
      title: "메다!",
      rating: 4.8,
      posterUrl: "/images/movie2.jpg"
    },
    {
      id: 3,
      title: "스틸워터 밸리 번지",
      rating: 4.8,
      posterUrl: "/images/movie3.jpg"
    }
  ];

  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-gray-2"
        style={{ 
          backgroundImage: `url(${movies[currentSlide].posterUrl})`,
          filter: 'blur(20px) brightness(0.3)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-8 to-transparent" />
      
      <div className="relative flex h-full mx-[6.25%] py-10 z-10">
        <div className="flex flex-col w-[25vw] h-full min-w-[300px]">
          {/* 왼쪽 리뷰 목록 */}
          <div className="flex items-center justify-between gap-3 mr-4 px-4 py-4 rounded-xl border border-gray-1 bg-black/20">
            <h2 className="text-2xl font-light tracking-tight">BEST REVIEW</h2>
            <ChevronDown className="w-6 h-6" /> 
          </div>
          <div className="flex-1 mt-4 mr-4">
            <div className="h-full flex flex-col justify-between gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 영화 슬라이더 */}
        <div className="flex-1 h-full">
          <MovieSlider 
            movies={movies} 
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
          />
        </div>
      </div>
    </div>
  );
};

export default BestReview; 