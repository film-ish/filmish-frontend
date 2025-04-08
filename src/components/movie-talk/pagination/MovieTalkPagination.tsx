import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getActors } from "../../../api/actor/getActor";
import { useState, useEffect } from "react";

interface MovieTalkPaginationProps {
  onPageChange: (page: number) => void;
  currentPage: number;
}

const MovieTalkPagination = ({ onPageChange, currentPage }: MovieTalkPaginationProps) => {
  const pageSize = 10;
  
  // 전체 배우 데이터 가져오기 (페이지네이션 정보 포함)
  const { data: actorsData, isLoading } = useQuery({
    queryKey: ['actors', 'count'],
    queryFn: async () => {
      // 첫 페이지 데이터를 가져와서 전체 개수 확인
      const response = await getActors(0, pageSize);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 전체 페이지 수 계산 (API 응답 구조에 맞게 수정)
  // 임시로 10페이지로 설정 (실제로는 API 응답에서 전체 페이지 수를 가져와야 함)
  const totalPages = 10;
  
  // 페이지 번호 배열 생성 (최대 5개까지만 표시)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // 현재 페이지 주변의 페이지 번호만 표시
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // 시작 페이지 조정
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageNumbers = getPageNumbers();

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 특정 페이지로 이동
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 my-8">
        <p className="text-gray-400">페이지 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 데이터가 없으면 페이지네이션 표시하지 않음
  if (!actorsData || actorsData.length === 0) {
    return null;
  }

  // 페이지가 1개 이상이면 페이지네이션 표시
  return (
    <div className="flex justify-center items-center gap-1 mb-20">
      <button 
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 ${
          currentPage === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100 shadow-sm'
        }`}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map(page => (
          <button 
            key={page} 
            onClick={() => handlePageClick(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 ${
              page === currentPage 
                ? 'bg-black border border-gray-300 text-white text-xl font-bold shadow-md' 
                : 'text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
            aria-label={`${page} 페이지로 이동`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 ${
          currentPage === totalPages 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100 shadow-sm'
        }`}
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MovieTalkPagination; 