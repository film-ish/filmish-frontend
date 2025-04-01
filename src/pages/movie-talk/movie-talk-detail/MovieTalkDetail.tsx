import { useState } from 'react';
import Header from '../../../components/movie-talk-detail/Header';
import Profile from '../../../components/movie-talk-detail/Profile';
import QnABoard from '../../../components/movie-talk-detail/QnABoard';
import Filmography from '../../../components/movie-talk-detail/Filmography';

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

const MovieTalkDetail = () => {
  const actorName = "우성윤";
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: '김덕윤',
      content: '안녕하세요?!',
      timestamp: '23시간 전',
      replies: [
        {
          id: 2,
          author: '우성윤',
          content: '나는 영화 좋아해',
          timestamp: '23시간 전'
        }
      ]
    },
    {
      id: 3,
      author: '우성윤',
      content: '안녕 못잡니다 ㅋㅋ',
      timestamp: '23시간 전',
      replies: []
    },
    {
      id: 4,
      author: '김덕윤',
      content: 'ㅋㅋ 화이팅',
      timestamp: '23시간 전',
      replies: []
    }
  ]);

  const filmography: FilmographyItem[] = [
        {
        title: '정욱',
        date: '2024.12.01',
        posterUrl: '/images/movie1.jpg'
        },
        {
        title: '정욱',
        date: '2024.12.01',
        posterUrl: '/images/movie1.jpg'
        },
        {
        title: '정욱',
        date: '2024.12.01',
        posterUrl: '/images/movie1.jpg'
        },
        {
        title: '정욱',
        date: '2024.12.01',
        posterUrl: '/images/movie1.jpg'
        },
        
        
    // 추가 영화 데이터...
  ];

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: comments.length + 1,
      author: '사용자',
      content,
      timestamp: '방금 전',
      replies: []
    };
    setComments([...comments, newComment]);
  };

  const handleAddReply = (commentId: number, content: string) => {
    const newReply: Comment = {
      id: Math.max(...comments.flatMap(c => [c.id, ...(c.replies?.map(r => r.id) || [])])) + 1,
      author: '사용자',
      content,
      timestamp: '방금 전'
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-8">
      <Header />
      <div className="flex h-[calc(100vh-5.5rem)]">
        <div className="w-[40%] flex flex-col mr-2">
          <div className="flex-1 flex flex-col">
            <Profile name={actorName} />
            <Filmography items={filmography} />
          </div>
        </div>
        <div className="w-[60%] ml-2">  
          <QnABoard 
            comments={comments}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieTalkDetail;
