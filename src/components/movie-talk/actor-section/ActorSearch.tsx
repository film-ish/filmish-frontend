import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import useDebounce from '../../../hooks/useDebounce';

interface ActorSearchProps {
  onSearch: (searchTerm: string) => void;
}

const ActorSearch: React.FC<ActorSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!isComposing) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch, isComposing]);

  // 검색창 밖을 클릭했을 때 검색창을 닫는 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleSearchClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchTerm('');
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="relative">
      <div
        ref={searchContainerRef}
        className={`flex items-center justify-center bg-gray-6 rounded-full px-4 py-2 shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'w-[300px]' : 'w-[40px]'
        }`}
      >
        {isExpanded ? (
          <>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder="배우 이름 검색..."
              className="outline-none bg-transparent text-gray-800 w-full"
            />
            {searchTerm && (
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleSearchClick}
            className="p-1 rounded-full hover:bg-gray-5"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActorSearch; 