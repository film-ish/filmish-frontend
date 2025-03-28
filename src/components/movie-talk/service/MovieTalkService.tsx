import { Film, Users, Calendar } from "lucide-react";

const MovieTalkService = () => {
  return (
    <div className="py-20 bg-gray-8 w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
      <h2 className="text-4xl font-bold text-center mb-4">서비스 특징</h2>
      <p className="text-center text-gray-5 mb-16">
        독립 영화 배우, 감독들의 정보와 팬 커뮤니티를 제공하는 서비스입니다. 다양한 기능을 통해 배우와 관람을 연결합니다.
      </p>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 독립 영화 중심 필모그래피 */}
          <div className="bg-gray-7 rounded-2xl p-8">
            <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mb-6">
              <Film className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-6">독립 영화 중심 필모그래피</h3>
            <p className="text-gray-5 mb-6">
              대형 영화 포털에서는 찾기 어려운 독립 영화 중심의 배우 정보와 필모그래피를 제공합니다.
            </p>
            <ul className="space-y-3 text-gray-5">
              <li>• 독립 영화 중심 배우 정보</li>
              <li>• 출연작 리스트와 대표 작품 필모그래피 제공</li>
              <li>• 배우가 참여한 영화제 정보</li>
            </ul>
          </div>

          {/* 팬 커뮤니티 */}
          <div className="bg-gray-7 rounded-2xl p-8">
            <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-6">팬 커뮤니티</h3>
            <p className="text-gray-5 mb-6">
              좋아하는 배우에 대해 이야기하고, 다른 팬들과 교류할 수 있는 전용 팬 게시판을 제공합니다.
            </p>
            <ul className="space-y-3 text-gray-5">
              <li>• 배우 전용 팬 게시판</li>
              <li>• Q&A 기능</li>
              <li>• 댓글 평점 시스템</li>
            </ul>
          </div>

          {/* 영화제 정보 */}
          <div className="bg-gray-7 rounded-2xl p-8">
            <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-6">영화제 정보</h3>
            <p className="text-gray-5 mb-6">
              배우가 참여한 다양한 영화제 정보를 제공합니다
            </p>
            <ul className="space-y-3 text-gray-5">
              <li>• 배우 전용 팬 게시판</li>
              <li>• Q&A 기능</li>
              <li>• 댓글 평점 시스템</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkService; 