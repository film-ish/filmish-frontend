import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieTalkPagination = () => {
  // 실제 구현에서는 페이지 상태와 변경 함수가 필요합니다
  const currentPage = 1;
  const totalPages = 5;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100">
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      {pages.map(page => (
        <button 
          key={page} 
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            page === currentPage 
              ? 'bg-black text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MovieTalkPagination; 