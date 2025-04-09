import ProfileImage from '../../common/ProfileImage';
import { Maker } from '../../../types/comment';
import { Link } from 'react-router';

interface MakerListProps {
  title: string;
  makers: Maker[];
}

const MakerList = ({ title, makers }: MakerListProps) => (
  <div className="flex flex-col gap-2">
    <div className="text-label-xl font-bold">{title}</div>
    <div className="flex gap-4">
      {makers.map((maker, index) => {
        if (index > 2) return null;
        return (
          <Link key={maker.id} to={`/movie-talk/${maker.id}`} className="flex flex-col items-center">
            <ProfileImage size={40} src={maker.thumbnailImage} />
            {maker.name}
          </Link>
        );
      })}
    </div>
  </div>
);

export default MakerList;
