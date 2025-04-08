import { useQuery } from '@tanstack/react-query';
import { getActors } from '../../../api/actor/getActor';
import MovieTalkMovingCard from "./card/MovieTalkMovingCard";
import { useEffect, useState } from 'react';

interface Actor {
  id: number;
  name: string;
  photoUrl: string;
  rating: number;
  qnaCnt: number;
  indieCnt: number;
  role: string;
}

const CardSet = ({ actors, isReverse = false }: { actors: Actor[], isReverse?: boolean }) => (
  <div className={`flex whitespace-nowrap ${isReverse ? 'animate-infiniteSlideDuplicate' : 'animate-infiniteSlideOriginal'}`}>
    {/* 첫 번째 세트 */}
    {actors.map((actor, index) => (
      <div key={`card-${actor.id || index}-${index}`} className="px-[11px]">
        <MovieTalkMovingCard actor={actor} />
      </div>
    ))}
    {/* 두 번째 세트 (복제) */}
    {actors.map((actor, index) => (
      <div key={`card-duplicate-${actor.id || index}-${index}`} className="px-[11px]">
        <MovieTalkMovingCard actor={actor} />
      </div>
    ))}
  </div>
);

const MovieTalkMoving = () => {
  // 로컬 상태에 데이터 저장
  const [page1Data, setPage1Data] = useState<Actor[]>([]);
  const [page2Data, setPage2Data] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 첫 번째 페이지 데이터
  const { data: firstPageData } = useQuery({
    queryKey: ['actors', 0],
    queryFn: () => getActors(0, 10),
    gcTime: 5 * 60 * 1000, // 5분
    staleTime: 2 * 60 * 1000,  // 2분
  });

  // 두 번째 페이지 데이터
  const { data: secondPageData } = useQuery({
    queryKey: ['actors', 1],
    queryFn: () => getActors(1, 10),
    gcTime: 5 * 60 * 1000, // 5분
    staleTime: 2 * 60 * 1000,  // 2분
  });

  // 데이터를 로컬 상태에 저장
  useEffect(() => {
    if (firstPageData) {
      setPage1Data(firstPageData);
      
      if (secondPageData) {
        // 확실히 두번째 페이지 데이터가 있는 경우만 설정
        if (JSON.stringify(firstPageData) !== JSON.stringify(secondPageData)) {
          setPage2Data(secondPageData);
        } else {
          // 데이터가 같으면 첫 번째 페이지의 순서만 반대로 하여 다르게 보이도록 함
          console.warn('첫 번째 페이지와 두 번째 페이지 데이터가 동일합니다.');
          const reversedData = [...firstPageData].reverse();
          setPage2Data(reversedData);
        }
      }
      
      setIsLoading(false);
    }
  }, [firstPageData, secondPageData]);

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden">
        <div className="flex justify-center items-center py-20">
          <p className="text-white">배우 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div className="flex relative py-3">
        <CardSet actors={page1Data} />
      </div>
      <div className="flex relative py-3">
        <CardSet actors={page2Data} isReverse />
      </div>
    </div>
  );
};
        
export default MovieTalkMoving;
    
