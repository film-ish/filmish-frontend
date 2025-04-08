import { apiClient } from "../instance/client";

interface MovieResult {
  id: number;
  title: string;
  poster: string;
  pubDate: string;
  runningTime: number;
  value: number;
  genre: Array<{ id: number; name: string }>;
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

interface SearchResponse {
  code: string;
  data: {
    movies: MovieResult[];
    actors: ActorResult[];
    directors: DirectorResult[];
    genreMovies: MovieResult[];
    keywordMovies: MovieResult[];
  };
  message: string;
}

const searchApi = async (keyword: string): Promise<SearchResponse> => {
  try {
    const response = await apiClient.get(`/knockknock?data=${encodeURIComponent(keyword)}`);
    
    // 응답 구조 확인 및 데이터 반환
    if (response.data && response.data.code === 'Ok' && response.data.data) {
      // 각 배열이 존재하는지 확인하고 안전하게 반환
      const data = response.data.data;
      return {
        code: response.data.code,
        message: response.data.message,
        data: {
          movies: Array.isArray(data.movies) ? data.movies : [],
          actors: Array.isArray(data.actors) ? data.actors : [],
          directors: Array.isArray(data.directors) ? data.directors : [],
          genreMovies: Array.isArray(data.genreMovies) ? data.genreMovies : [],
          keywordMovies: Array.isArray(data.keywordMovies) ? data.keywordMovies : []
        }
      };
    } else {
      return {
        code: "Error",
        data: {
          movies: [],
          actors: [],
          directors: [],
          genreMovies: [],
          keywordMovies: []
        },
        message: "검색 결과를 가져오는 중 오류가 발생했습니다."
      };
    }
  } catch (error) {
    // 오류 발생 시 빈 결과 반환
    return {
      code: "Error",
      data: {
        movies: [],
        actors: [],
        directors: [],
        genreMovies: [],
        keywordMovies: []
      },
      message: "검색 중 오류가 발생했습니다."
    };
  }
};

export { searchApi };

