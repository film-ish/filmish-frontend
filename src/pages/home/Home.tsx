import BestReview from '../../components/home/best-review/BestReview';
import PersonalRecommend from '../../components/home/personal-recommendation/PersonalRecommend';
import TopTen from '../../components/home/topten/TopTen';
import { ChevronRight, CircleAlert } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-20 py-12">
      {/* Best Review 섹션 */}
      <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
        <BestReview />
      </section>

      {/* 개인 맞춤 추천 영화 섹션 */}
      <section className="relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">개인 맞춤 추천 영화</h2>
            <button className="text-gray-4 hover:text-white transition-colors">
              <CircleAlert className="w-5 h-5" />
            </button>
          </div>

          <button className="flex items-center gap-2 text-sm text-gray-4 hover:text-white transition-colors">더보기 <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="relative w-[calc(100vw-6.25%)] overflow-hidden">
          <PersonalRecommend />
        </div>
      </section>

      {/* 좋아요 TOP 10 섹션 */}
      <section className="relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight">좋아요 TOP 10</h2>
          <button className="flex items-center gap-2 text-sm text-gray-4 hover:text-white transition-colors">더보기 <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="relative w-[calc(100vw-6.25%)] overflow-hidden">
          <TopTen />
        </div>
      </section>

      {/* 평점 TOP 10 섹션 */}
      <section className="relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight">평점 TOP 10</h2>
          <button className="flex items-center gap-2 text-sm text-gray-4 hover:text-white transition-colors">더보기 <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="relative w-[calc(100vw-6.25%)] overflow-hidden">
          <TopTen />
        </div>
      </section>
    </div>
  );
};

export default Home;
