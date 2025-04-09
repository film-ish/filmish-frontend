import { useState } from 'react';
import ReviewCard from './review-card/ReviewCard';
import MovieSlider from './movie-slider/MovieSlider';
import { ChevronDown } from 'lucide-react';

interface Review {
  id: number;
  title: string;
  content: string;
  date: string;
  rating: number;
  username: string;
}

interface Movie {
  id: number;
  title: string;
  rating: number;
  posterUrl: string;
  stillcut: string;
}

interface BestReviewProps {
  reviews: Review[];
  movies: Movie[];
}

const BestReview = ({ reviews, movies }: BestReviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExploreMode, setIsExploreMode] = useState(false);

  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-gray-2 duration-500"
        style={{
          backgroundImage: `url(${movies[currentSlide]?.stillcut || '/no-poster.png'})`,
          filter: 'blur(10px) brightness(1)',
          transform: 'scale(1.1)',
        }}
      />

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-8 to-transparent" />

      <div className="relative flex h-full mx-[6.25%] py-10 z-10">
        <div className="flex flex-col w-[25vw] h-full min-w-[300px]">
          {/* 왼쪽 리뷰 목록 */}
          <div className="flex items-center justify-between gap-3 mr-4 px-4 py-4 rounded-xl border border-gray-1 bg-white/20 backdrop-blur-xl">
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
          <MovieSlider movies={movies} currentSlide={currentSlide} onSlideChange={setCurrentSlide} />
        </div>
      </div>
    </div>
  );
};

export default BestReview;
