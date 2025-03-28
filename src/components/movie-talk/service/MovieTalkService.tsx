import { InfoIcon, BookIcon, HelpCircleIcon } from "lucide-react";

const MovieTalkService = () => {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold text-center mb-6">서비스 특징</h3>
      <p className="text-center text-sm text-gray-600 mb-8">
        독립 영화 배우 정보와 관련된 커뮤니티 서비스를 제공합니다.<br />
        회원 가입하시면 다양한 정보를 안내해드립니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 특징 1: 독립 영화 중심 필모그래피 */}
        <div className="border rounded-lg p-6 flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <InfoIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg mb-3">독립 영화 중심 필모그래피</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>영화 정보 출처/제공 안내</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>필터링/카테고리별 찾기 제공</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>배우가 참여한 작품 정보 열람</span>
            </li>
          </ul>
        </div>
        
        {/* 특징 2: 팬 커뮤니티 */}
        <div className="border rounded-lg p-6 flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <BookIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg mb-3">팬 커뮤니티</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>배우 정보 열람/서비스 안내</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Q&A 기능</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>오류 정보 서비스</span>
            </li>
          </ul>
        </div>
        
        {/* 특징 3: 영화제 정보 */}
        <div className="border rounded-lg p-6 flex flex-col items-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <HelpCircleIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg mb-3">영화제 정보</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>배우 참여 영화제 정보</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Q&A 기능</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>오픈 티켓 서비스</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieTalkService; 