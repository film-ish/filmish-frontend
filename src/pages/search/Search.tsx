import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { searchApi } from '../../api/header/searchApi';
import MovieCard from '../../components/movie/MovieCard';
import { useAuthStore } from '../../store/authStore';
import { Film, ChevronRight } from 'lucide-react';
import React from 'react';

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
      errorInfo,
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

const SearchContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword') || '';
  const [searchResults, setSearchResults] = useState<SearchResults>({
    movies: [],
    actors: [],
    directors: [],
    genreMovies: [],
    keywordMovies: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword.trim()) {
        setSearchResults({
          movies: [],
          actors: [],
          directors: [],
          genreMovies: [],
          keywordMovies: [],
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchApi(keyword);

        if (response && response.data) {
          // API 응답 구조 확인 및 데이터 설정
          const data = response.data as any;

          setSearchResults({
            movies: data.movies || [],
            actors: data.actors || [],
            directors: data.directors || [],
            genreMovies: data.genreMovies || [],
            keywordMovies: data.keywordMovies || [],
          });
        } else {
          setSearchResults({
            movies: [],
            actors: [],
            directors: [],
            genreMovies: [],
            keywordMovies: [],
          });
        }
      } catch (err) {
        setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
        setSearchResults({
          movies: [],
          actors: [],
          directors: [],
          genreMovies: [],
          keywordMovies: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  // 모든 영화 결과를 합침
  const allMovies = [...searchResults.movies, ...searchResults.genreMovies];

  // 중복 제거 (id 기준)
  const uniqueMovies = allMovies.filter((movie, index, self) => index === self.findIndex((m) => m.id === movie.id));

  // 더보기 페이지로 이동하는 함수
  const handleMoreClick = (type: string) => {
    navigate(`/search/more?keyword=${keyword}&type=${type}`);
  };

  return (
    <div className="container mx-auto px-4 pt-10 pb-12">
      <h1 className="text-3xl font-bold mb-8">통합 검색</h1>

      {/* 검색어 표시 */}
      {keyword && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">"{keyword}" 검색 결과</h2>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 오류 상태 */}
      {error && <div className="text-red-500 text-center py-8">{error}</div>}

      {/* 검색 결과 없음 */}
      {!isLoading &&
        !error &&
        keyword &&
        uniqueMovies.length === 0 &&
        searchResults.actors.length === 0 &&
        searchResults.directors.length === 0 &&
        searchResults.keywordMovies.length === 0 && (
          <div className="text-center py-12 text-gray-400">검색 결과가 없습니다. 다른 키워드로 검색해보세요.</div>
        )}

      {/* 영화 검색 결과 */}
      {uniqueMovies.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">영화 ({uniqueMovies.length}개)</h3>
            {/* {uniqueMovies.length > 5 && (
              <button
                onClick={() => handleMoreClick('movies')}
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                더보기 <ChevronRight size={16} className="ml-1" />
              </button>
            )} */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {uniqueMovies.map((movie) => {
              console.log(movie);
              return (
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
                  isLiked={movie.like}
                  onLike={() => {}}
                  iconType="star"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 배우 검색 결과 */}
      {searchResults.actors && searchResults.actors.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">배우 ({searchResults.actors.length}개)</h3>
            {searchResults.actors.length > 5 && (
              <button
                onClick={() => handleMoreClick('actors')}
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                더보기 <ChevronRight size={16} className="ml-1" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {searchResults.actors.slice(0, 5).map((actor) => (
              <Link key={actor.id} to={`/movie-talk/${actor.id}`} className="flex flex-col items-center">
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
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 감독 검색 결과 */}
      {searchResults.directors && searchResults.directors.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">감독 ({searchResults.directors.length}개)</h3>
            {searchResults.directors.length > 5 && (
              <button
                onClick={() => handleMoreClick('directors')}
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                더보기 <ChevronRight size={16} className="ml-1" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {searchResults.directors.slice(0, 5).map((director) => (
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
                  <p className="text-sm text-gray-400">{director.filmography ? director.filmography.length : 0} 작품</p>
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
        </div>
      )}

      {/* 키워드 검색 결과 */}
      {searchResults.keywordMovies && searchResults.keywordMovies.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">키워드 검색 결과</h3>
          {searchResults.keywordMovies.map((group, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium">
                  "{group.name}" 관련 영화 ({group.movies.length}개)
                </h4>
                {group.movies.length > 5 && (
                  <button
                    onClick={() => handleMoreClick(`keyword-${group.name}`)}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                    더보기 <ChevronRight size={16} className="ml-1" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {group.movies.slice(0, 5).map((movie) => (
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
            </div>
          ))}
        </div>
      )}

      {/* 초기 상태 */}
      {!isLoading && !error && !keyword && <div className="text-center py-12 text-gray-400">검색어를 입력하세요.</div>}
    </div>
  );
};

// 오류 경계로 감싸진 Search 컴포넌트
const Search = () => {
  return (
    <ErrorBoundary>
      <SearchContent />
    </ErrorBoundary>
  );
};

export default Search;
