import StillcutViewer from '../../components/movie-detail/detail/StillcutViewer';
import MakerList from '../../components/movie-detail/detail/MakerList';
import { useOutletContext } from 'react-router';
import { MovieData } from '../../types/movie';
const DetailPage = () => {
  const movie = useOutletContext<MovieData>();

  const actors = movie?.makers.filter((maker) => maker.type.toLowerCase() === 'actor') ?? [];
  const directors = movie?.makers.filter((maker) => maker.type.toLowerCase() === 'director') ?? [];

  if (!movie) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10 text-paragraph-md">
      <StillcutViewer stillcuts={movie.stillcuts} />

      <section className="flex flex-col gap-2">
        <div className="text-label-xl font-bold">시놉시스</div>
        <div>{movie.plot}</div>
      </section>

      <section className="flex gap-6">
        <MakerList title="출연진" makers={actors} />
        <MakerList title="감독" makers={directors} />
      </section>
    </div>
  );
};

export default DetailPage;
