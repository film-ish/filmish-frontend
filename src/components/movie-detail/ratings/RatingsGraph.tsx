const stars = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

interface RatingsGraphProps {
  totalCounts: number;
  ratings: {
    [key: string]: number;
  };
}

const RatingsGraph = ({ totalCounts, ratings }: RatingsGraphProps) => {
  return (
    <div className="w-full flex flex-col justify-between p-4 bg-gray-7 rounded-[5px]">
      <div className="text-label-lg">별점 그래프</div>
      <div className="w-full flex justify-between">
        {stars.map((star) => {
          const height = ((ratings ? ratings[star.toFixed(1)] : 0) / (totalCounts ? totalCounts : 1)) * 100;
          return (
            <div key={star} className="flex flex-col items-center justify-end h-[84px] text-label-sm">
              <div
                className={
                  'w-[15px] min-h-[10px] h-[10px] rounded-[10px] border-[1px] border-white transition-[height]'
                }
                style={{ height: `${height}%`, backgroundColor: height ? 'white' : 'transparent' }}
              />
              <div className="min-h-[20px]">{Number.isInteger(star) ? star : null}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingsGraph;
