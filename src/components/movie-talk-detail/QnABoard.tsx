import { useState } from 'react';
import QnaItem from './QnaItem.tsx';
import QnaPostInput from './QnaPostInput';

interface CoComment {
  id: number;
  writerName: string;
  writerImage: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  writerName: string;
  writerImage: string;
  content: string;
  createdAt: string;
  cocomments?: CoComment[];
}

interface QnaItemType {
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

interface QnABoardProps {
  qnaList: QnaItemType[];
  onAddQna: (title: string, content: string) => void;
  onAddComment: (qnaId: number, content: string) => void;
  onAddReply: (qnaId: number, commentId: number, content: string) => void;
  onUpdateQna: (qnaId: number, title: string, content: string) => void;
  onDeleteQna: (qnaId: number) => void;
}

const QnABoard = ({ qnaList, onAddQna, onAddComment, onAddReply, onUpdateQna, onDeleteQna }: QnABoardProps) => {
  const [showQnaForm, setShowQnaForm] = useState(false);

  console.log('QnaBoard qnaList:', qnaList);

  return (
    <div className="flex flex-col bg-white/10 rounded-lg h-full px-4">
      <div className="pt-5 pb-3 flex justify-between items-center">
        <h3 className="text-xl font-bold">Q&A 게시판</h3>
        <button 
          onClick={() => setShowQnaForm(!showQnaForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {showQnaForm ? '취소' : 'Q&A 작성'}
        </button>
      </div>
      <div className="border-b border-gray-5/50 pt-2"></div>
      
      {showQnaForm && (
        <div className="my-4">
          <QnaPostInput 
            onSubmit={(title, content) => {
              onAddQna(title, content);
              setShowQnaForm(false);
            }}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto rounded-lg pr-2 mt-4">
        <div className="space-y-6">
          {qnaList.length > 0 ? (
            qnaList.map((qna) => (
          <QnaItem 
            key={qna.id} 
            qna={qna} 
            onAddComment={(content) => onAddComment(qna.id, content)}
            onAddReply={(commentId, content) => onAddReply(qna.id, commentId, content)}
            onUpdateQna={(qnaId, title, content) => onUpdateQna(qna.id, title, content)}
            onDeleteQna={() => onDeleteQna(qna.id)}
          />
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              아직 Q&A가 없습니다. 첫 질문을 남겨보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QnABoard;
