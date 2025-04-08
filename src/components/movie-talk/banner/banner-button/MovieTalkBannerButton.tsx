import { ChevronRight } from "lucide-react";    

const MovieTalkBannerButton = () => {
    // 배우 섹션으로 스크롤하는 함수
    const scrollToActorSection = () => {
        // 배우 섹션 요소 찾기
        const actorSection = document.querySelector('[data-actor-section]');
        if (actorSection) {
            actorSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <button 
            onClick={scrollToActorSection}
            className="flex items-center gap-2 bg-gray-6 text-white px-[23px] py-[15px] font-bold rounded-full hover:bg-gray-100 transition-colors text-[15px]"
        >
            <span>배우 프로필 둘러보기</span>
            <ChevronRight className="w-4 h-4" />
        </button>
    );
  };
    
  export default MovieTalkBannerButton;
  