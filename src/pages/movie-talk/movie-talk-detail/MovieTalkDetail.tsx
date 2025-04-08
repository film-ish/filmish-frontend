import { useEffect, useState } from 'react';
import Profile from '../../../components/movie-talk-detail/Profile';
import QnABoard from '../../../components/movie-talk-detail/QnABoard';
import Filmography from '../../../components/movie-talk-detail/Filmography';
import { useParams } from 'react-router';
import { detailActors } from '../../../api/actor/getActor';
import { createComment, createReply, listQna } from '../../../api/actor/getQna'
import { idbStorage } from '../../../lib/idbStorage';

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

interface FilmographyItem {
  title: string;
  date: string;
  posterUrl?: string;
}

interface ActorDetail {
  id: number;
  userId: number;
  name: string;
  image?: string;
  qnaCnt: number;
  filmography?: FilmographyItem[];
  // API 응답에 따라 필요한 필드 추가
}

interface ListQna {
  id: number;
  makerId: number;
  writername: string;
  writerImage: string;
  createdAt:string;
  updatedAt:string;
  content:string;
  commentsCnt: number;
}

const MovieTalkDetail = () => {

  const { makerId } = useParams<{ makerId: string }>();
  console.log("makerId:", makerId); // URL에서 가져온 makerId 확인
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actorDetail, setActorDetail] = useState<ActorDetail | null>(null);
  const [qnaList, setQnaList] = useState<ListQna[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);



  useEffect(() => {
  const fetchData = async () => {
    console.log('fetchData 함수 시작');
    try {
      console.log('API 호출 직전:', makerId);
      const result = await detailActors(Number(makerId));
      console.log('API 호출 결과:', result);
    } catch (err) {
      console.error('컴포넌트에서 오류:', err);
    }
  };
  
  fetchData();
}, [makerId]);

    // 배우 상세 정보 가져오기
    useEffect(() => {
      const fetchActorDetail = async () => {
        if (!makerId) {
          setLoading(false); // makerId가 없어도 로딩 상태 종료
          return;
        }
        try {
          setLoading(true);
          console.log('API 호출 시작:', makerId);
          const data = await detailActors(Number(makerId));
          console.log('API 응답:', data); // 데이터 확인
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


    // QnA 목록 가져오기
    useEffect(() => {
      const fetchQnaList = async () => {
        if (!makerId) return;
        
        try {
          console.log("listQna 호출 직전:", makerId);
          const data = await listQna(Number(makerId), 0, 10);
          console.log("listQna 응답 결과:", data);
          
          // 기본값으로 빈 배열 사용
          setComments(
            (Array.isArray(data) ? data : []).map((qna: ListQna) => ({
              id: qna.id,
              author: qna.writername,
              content: qna.content,
              timestamp: new Date(qna.createdAt).toLocaleString(),
              replies: [],
            }))
          );


        } catch (err) {
          console.error("QnA 목록을 불러오는데 실패했습니다:", err);
          setComments([]);
        }
      };
      
      fetchQnaList();
    }, [makerId]);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}분 전`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    
    return date.toLocaleDateString();
  };

  const handleAddComment = async (content: string) => {
    if (!makerId) return;
    try {
      const value = await idbStorage.getItem('auth_storage');
      
      // 반환된 값이 문자열이라면 (null이 아닌 경우) 객체로 다시 변환
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        console.log('Retrieved auth_storage:', parsedValue);
        return parsedValue;
      } else {
        console.log('auth_storage not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting auth_storage:', error);
      return null;
    }
    try {
      const newCommentData = await createComment(Number(makerId), content);
      console.log("댓글 생성 API 응답:", newCommentData);
  
      const newComment: Comment = {
        id: newCommentData.id,
        author: nickname,
        content: newCommentData.content, // API 응답에 content가 없으면 입력값 사용
        timestamp: formatTimestamp(new Date().toISOString()), // 현재 시간으로 설정
        replies: [],
      };
  
      setComments((prev) => [...prev, newComment]);
    } catch (err) {
      console.error("댓글 추가에 실패했습니다:", err);
    }
  };

  const handleAddReply = async (commentId: number, content: string) => {
    try {
      const newReplyData = await createReply(Number(makerId), commentId, content);
      
      const newReply: Comment = {
        id: newReplyData.id,
        author: newReplyData.writerName || '탈퇴한 사용자',
        content: newReplyData.content,
        timestamp: formatTimestamp(newReplyData.createdAt)
      };

      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );

    } catch (err) {
      console.error('답글 추가에 실패했습니다:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }
  
  return (
    <div className="bg-gray-8">
      <div className="flex h-[calc(100vh-5.5rem)]">
        <div className="w-[40%] flex flex-col mr-2">
          <div className="flex-1 flex flex-col">
          <Profile name={actorDetail?.name || '이름 없음'} />
          <Filmography items={actorDetail?.filmography || []} />
          </div>
        </div>
        <div className="w-[60%] ml-2">
          <QnABoard comments={comments} onAddComment={handleAddComment} onAddReply={handleAddReply} />
        </div>
      </div>
    </div>
  );
};

export default MovieTalkDetail;
