import { useEffect, useState } from 'react';
import Profile from '../../../components/movie-talk-detail/Profile';
import QnABoard from '../../../components/movie-talk-detail/QnABoard';
import Filmography from '../../../components/movie-talk-detail/Filmography';
import { useParams } from 'react-router';
import { detailActors } from '../../../api/actor/getActor';

interface FilmographyItem {
  movieName: string;
  movieId: number;
  pubDate?: string;
  poster?: string;
  stillCut?: string;
}

interface ActorDetail {
  id: number;
  userId: number;
  name: string;
  image?: string;
  qnaCnt: number;
  filmography?: FilmographyItem[];
}

const MovieTalkDetail = () => {
  const { makerId } = useParams<{ makerId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actorDetail, setActorDetail] = useState<ActorDetail | null>(null);

  // 배우 상세 정보 가져오기
  useEffect(() => {
    const fetchActorDetail = async () => {
      if (!makerId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await detailActors(Number(makerId));
        
        // API 응답이 유효한지 확인
        if (!data) {
          throw new Error('배우 정보를 찾을 수 없습니다.');
        }
        
        // 필수 필드가 있는지 확인
        if (data.id === undefined || data.userId === undefined || data.name === undefined) {
          console.error('API 응답 형식 오류:', data);
          throw new Error('배우 정보 형식이 올바르지 않습니다.');
        }
        
        setActorDetail(data);
      } catch (err) {
        console.error('배우 정보를 불러오는데 실패했습니다:', err);
        setError('배우 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetail();
  }, [makerId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-8">
      <div className="flex mt-20 h-[calc(100vh-5.5rem)]">
        <div className="relative w-[40%] flex flex-col mr-2">
          <img src="/6.png" alt="background" className='absolute bottom-55 right-0 w-50 h-full object-contain z-0' />
          <img 
            src="/5.png" 
            alt="background" 
            className='absolute top-8 left-0 w-60 h-full object-contain z-0' 
          />
          <div className="relative z-10 flex-1 flex flex-col font-HakgyoansimChulseokbuTTF-B">
            <Profile name={actorDetail?.name || '이름 없음'} profileImage={actorDetail?.image || '/no-poster.png'} />
            <Filmography items={actorDetail?.filmography || []} />
          </div>
        </div>
        <div className="w-[60%] ml-2">
          <QnABoard makerId={Number(makerId)} />
        </div>
      </div>
    </div>
  );
};

export default MovieTalkDetail;
