import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchApi } from '../../api/header/searchApi';
import MovieCard from '../../components/movie/MovieCard';
import { useAuthStore } from '../../store/authStore';
import { Film, ArrowLeft } from 'lucide-react';
import React from 'react';
import { ROUTES } from '../../router/routes';
import { searchKeywordApi, searchMovieApi, searchActorApi, searchDirectorApi, searchGenreApi } from '../../api/header/searchMoreApi';
// 오류 경계 컴포넌트
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 pt-24 pb-12">
          <h1 className="text-3xl font-bold mb-8">오류가 발생했습니다</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>검색 기능을 사용하는 중 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.</p>
            {/* 개발 환경에서만 오류 상세 정보 표시 */}
            {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
              <details className="mt-2">
                <summary>오류 상세 정보</summary>
                <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// API 응답 타입 정의
interface MovieResult {
  id: string;
  title: string;
  poster: string | null;
  pubDate: string | null;
  runningTime: number | null;
  rate: number | null;
  genres: string[] | null;
}

interface ActorResult {
  id: string;
  name: string;
  image: string | null;
  filmography: string[];
  qnaNum: number;
}

interface DirectorResult {
  id: string;
  name: string;
  image: string | null;
  filmography: string[];
  qnaNum: number;
}

interface KeywordMovieGroup {
  name: string;
  movies: MovieResult[];
}

interface SearchResults {
  movies: MovieResult[];
  actors: ActorResult[];
  directors: DirectorResult[];
  genreMovies: MovieResult[];
  keywordMovies: KeywordMovieGroup[];
}

const SearchMoreContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword') || '';
  const type = searchParams.get('type') || '';
  const [searchResults, setSearchResults] = useState<SearchResults>({
    movies: [],
    actors: [],
    directors: [],
    genreMovies: [],
    keywordMovies: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword.trim()) {
        navigate(ROUTES.SEARCH);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchKeywordApi(keyword);
        const movieResponse = await searchMovieApi(keyword);
        const actorResponse = await searchActorApi(keyword);
        const directorResponse = await searchDirectorApi(keyword);
        const genreResponse = await searchGenreApi(keyword);
        
        if (response && response.data) {
          // API 응답 구조 확인 및 데이터 설정
          const data = response.data as any;
          
          setSearchResults({
            movies: movieResponse.data.movies || [],
            actors: actorResponse.data.actors || [],
            directors: directorResponse.data.directors || [],
            genreMovies: genreResponse.data.genreMovies || [],
            keywordMovies: data.keywordMovies || []
          });
        } else {
          setSearchResults({
            movies: [],
            actors: [],
            directors: [],
            genreMovies: [],
            keywordMovies: []
          });
        }
      } catch (err) {
        setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
        setSearchResults({
          movies: [],
          actors: [],
          directors: [],
          genreMovies: [],
          keywordMovies: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, navigate]);

  // 모든 영화 결과를 합침
  const allMovies = [
    ...searchResults.movies,
    ...searchResults.genreMovies
  ];

  // 중복 제거 (id 기준)
  const uniqueMovies = allMovies.filter((movie, index, self) =>
    index === self.findIndex((m) => m.id === movie.id)
  );

  // 검색 결과 타입에 따라 제목 설정
  const getTitle = () => {
    switch (type) {
      case 'movies':
        return `영화 검색 결과 (${uniqueMovies.length}개)`;
      case 'actors':
        return `배우 검색 결과 (${searchResults.actors.length}개)`;
      case 'directors':
        return `감독 검색 결과 (${searchResults.directors.length}개)`;
      case 'genres':
        return `장르 검색 결과 (${searchResults.genreMovies.length}개)`;
      case 'keyword-movies':
        return `키워드 검색 결과 (${searchResults.keywordMovies.length}개)`;
      default:
        if (type.startsWith('keyword-')) {
          const keywordName = type.replace('keyword-', '');
          const group = searchResults.keywordMovies.find(g => g.name === keywordName);
          return group ? `"${keywordName}" 관련 영화 (${group.movies.length}개)` : '키워드 검색 결과';
        }
        return '검색 결과';
    }
  };

  // 검색 결과 타입에 따라 데이터 반환
  const getData = () => {
    switch (type) {
      case 'movies':
        return uniqueMovies;
      case 'actors':
        return searchResults.actors;
      case 'directors':
        return searchResults.directors;
      default:
        if (type.startsWith('keyword-')) {
          const keywordName = type.replace('keyword-', '');
          const group = searchResults.keywordMovies.find(g => g.name === keywordName);
          return group ? group.movies : [];
        }
        return [];
    }
  };

  // 검색 결과 타입에 따라 렌더링 함수 반환
  const renderContent = () => {
    const data = getData();
    
    if (type === 'movies' || type.startsWith('keyword-')) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.map((movie: any) => (
            <MovieCard
              key={movie.id}
              movie={{
                id: parseInt(movie.id),
                title: movie.title,
                posterPath: movie.poster || '/no-poster.png',
                rating: movie.rate || 0,
                likes: 0,
                genres: movie.genres || [],
                runningTime: movie.runningTime || 0,
                pubDate: movie.pubDate || '',
              }}
              isLoggedIn={isLoggedIn}
              iconType="star"
            />
          ))}
        </div>
      );
    } else if (type === 'actors') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {data.map((actor: any) => (
            <div key={actor.id} className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-2 bg-gray-700">
                <img 
                  src={actor.image || '/no-poster-long.png'} 
                  alt={actor.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/no-profile-long.png';
                  }}
                />
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-white">{actor.name}</h4>
                <p className="flex items-center gap-1 text-sm text-gray-400">
                  <Film size={16} />
                  {actor.filmography ? actor.filmography.length : 0} 작품
                </p>
                {actor.filmography && actor.filmography.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {actor.filmography.slice(0, 2).join(', ')}
                    {actor.filmography.length > 2 ? ' 외' : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (type === 'directors') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {data.map((director: any) => (
            <div key={director.id} className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-2 bg-gray-700">
                <img 
                  src={director.image || '/no-poster-long.png'} 
                  alt={director.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/no-profile-long.png';
                  }}
                />
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-white">{director.name}</h4>
                <p className="text-sm text-gray-400">
                  {director.filmography ? director.filmography.length : 0} 작품
                </p>
                {director.filmography && director.filmography.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {director.filmography.slice(0, 2).join(', ')}
                    {director.filmography.length > 2 ? ' 외' : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="container mx-auto px-4 pt-10 pb-12">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(`/search?keyword=${keyword}`)}
          className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
        >
          <ArrowLeft size={20} className="mr-1" /> 돌아가기
        </button>
        <h1 className="text-3xl font-bold">"{keyword}" {getTitle()}</h1>
      </div>
      
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 오류 상태 */}
      {error && (
        <div className="text-red-500 text-center py-8">{error}</div>
      )}

      {/* 검색 결과 없음 */}
      {!isLoading && !error && getData().length === 0 && (
        <div className="text-center py-12 text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}

      {/* 검색 결과 */}
      {!isLoading && !error && getData().length > 0 && renderContent()}
    </div>
  );
};

// 오류 경계로 감싸진 SearchMore 컴포넌트
const SearchMore = () => {
  return (
    <ErrorBoundary>
      <SearchMoreContent />
    </ErrorBoundary>
  );
};

export default SearchMore; 