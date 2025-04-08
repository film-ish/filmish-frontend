import { useEffect, useState } from 'react';
import Profile from '../../../components/movie-talk-detail/Profile';
import QnABoard from '../../../components/movie-talk-detail/QnABoard';
import Filmography from '../../../components/movie-talk-detail/Filmography';
import { useParams } from 'react-router';
import { detailActors } from '../../../api/actor/getActor';
import { createComment, createQna, createReply, listQna, updateQna } from '../../../api/actor/getQna'
import { idbStorage } from '../../../lib/idbStorage';

interface Comment {
  id: number;
  writerName: string;
  writerImage: string;
  content: string;
  createdAt: string;
  cocomments?: CoComment[];
}

interface CoComment {
  id: number;
  writerName: string;
  writerImage: string;
  content: string;
  createdAt: string;
}

interface QnaItem {
  id: number;
  title: string;
  writerName: string;
  writerImage: string;
  createdAt: string;
  updatedAt: string | null;
  content: string;
  commentsNum: number;
  comments?: Comment[];
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
}

const MovieTalkDetail = () => {
  const { makerId } = useParams<{ makerId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actorDetail, setActorDetail] = useState<ActorDetail | null>(null);
  const [qnaList, setQnaList] = useState<QnaItem[]>([]);

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
        const response = await listQna(Number(makerId), 0, 10);
        console.log("QnA 응답 결과:", response);
        
        if (Array.isArray(response)) {
          setQnaList(response);
        }
      } catch (err) {
        console.error("QnA 목록을 불러오는데 실패했습니다:", err);
        setQnaList([]);
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

  const handleAddQna = async (title: string, content: string) => {
    if (!makerId) return;

    try {
      const value = await idbStorage.getItem('user-storage');
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        const userId = parsedValue.state.id;
        const nickname = parsedValue.state.nickname;
        
        const newQnaData = await createQna(Number(makerId), title, content);
        console.log("QnA 생성 API 응답:", newQnaData);
        
        const newQna: QnaItem = {
          id: newQnaData.id || Date.now(),
          title: title,
          writerName: nickname,
          writerImage: parsedValue.state.profileImage || '',
          createdAt: new Date().toISOString(),
          updatedAt: null,
          content: content,
          commentsNum: newQnaData.commentsNum,
          comments: []
        };

        setQnaList(prev => [newQna, ...prev]);
      }
    } catch (error) {
      console.error("QnA 추가에 실패했습니다:", error);
    }
  };

  const handleAddComment = async (qnaId: number, content: string) => {
    try {
      const value = await idbStorage.getItem('user-storage');
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        const nickname = parsedValue.state.nickname;
        
        const newCommentData = await createComment(qnaId, content);
        console.log("댓글 생성 API 응답:", newCommentData);
        
        const newComment: Comment = {
          id: newCommentData.id || Date.now(),
          writerName: nickname,
          writerImage: parsedValue.state.profileImage || '',
          content: content,
          createdAt: new Date().toISOString(),
          cocomments: []
        };

        setQnaList(prev => 
          prev.map(qna => 
            qna.id === qnaId 
              ? { 
                  ...qna, 
                  commentsNum: qna.commentsNum + 1,
                  comments: [...(qna.comments || []), newComment] 
                }
              : qna
          )
        );
      }
    } catch (error) {
      console.error("댓글 추가에 실패했습니다:", error);
    }
  };

  const handleAddReply = async (qnaId: number, commentId: number, content: string) => {
    try {
      const value = await idbStorage.getItem('user-storage');
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        const nickname = parsedValue.state.nickname;
        
        const newReplyData = await createReply(Number(makerId), commentId, content);
        console.log("답글 생성 API 응답:", newReplyData);
        
        const newReply: CoComment = {
          id: newReplyData.id || Date.now(),
          writerName: nickname,
          writerImage: parsedValue.state.profileImage || '',
          content: content,
          createdAt: new Date().toISOString()
        };

        setQnaList(prev => 
          prev.map(qna => 
            qna.id === qnaId 
              ? { 
                  ...qna, 
                  comments: (qna.comments || []).map(comment =>
                    comment.id === commentId
                      ? { ...comment, cocomments: [...(comment.cocomments || []), newReply] }
                      : comment
                  )
                }
              : qna
          )
        );
      }
    } catch (error) {
      console.error("답글 추가에 실패했습니다:", error);
    }
  };

  const handleUpdateQna = async (qnaId: number, title: string, content: string) => {
    try {
      const value = await idbStorage.getItem('user-storage');
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        const userId = parsedValue.state.id;
        
        const updatedQnaData = await updateQna(qnaId, title, content);
        console.log("QnA 수정 API 응답:", updatedQnaData);
        
        // 수정된 QnA 정보로 상태 업데이트
        setQnaList(prev => prev.map(qna => 
          qna.id === qnaId 
            ? {
                ...qna,
                title: title,
                content: content,
                updatedAt: new Date().toISOString(),
              }
            : qna
        ));
      }
    } catch (error) {
      console.error("QnA 수정에 실패했습니다:", error);
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
        <QnABoard 
        qnaList={qnaList} 
        onAddQna={handleAddQna} 
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onUpdateQna={handleUpdateQna}
        onDeleteQna={(qnaId) => console.log('삭제 기능 구현 필요', qnaId)} // 임시 구현
  />
        </div>
      </div>
    </div>
  );
};

export default MovieTalkDetail;
