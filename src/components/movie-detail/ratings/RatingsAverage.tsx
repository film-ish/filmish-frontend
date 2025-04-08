import { Star } from 'lucide-react';

interface RatingsAverageProps {
  totalCounts: number;
  avgScore: number;
}

const RatingsAverage = ({ totalCounts, avgScore }: RatingsAverageProps) => {
  const fractionDigits = Number.isInteger(avgScore) ? 1 : 2;

  return (
    <div className="shrink-0 flex flex-col p-4 bg-gray-7 rounded-[5px]">
      <div className="text-label-lg">별점 평균</div>
      <div className="flex gap-4">
        <div className="flex items-center font-bold text-heading-xs">
          <Star className="fill-rose-cloud" stroke={0} />
          <span>{avgScore?.toFixed(fractionDigits)}</span>
        </div>

        <div className="flex flex-col gap-2 items-center p-4 bg-gray-8 rounded-[10px]">
          <div className="text-label-xxl font-bold">{totalCounts?.toLocaleString()}명</div>
          <div className="text-label-md">별점 개수</div>
        </div>
      </div>
    </div>
  );
};

export default RatingsAverage;
