interface ReviewCardProps {
  review: {
    title: string;
    content: string;
    date: string;
    rating: number;
    username: string;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="h-full bg-white/10 rounded-xl p-6 flex flex-col hover:bg-white/20 transition-colors cursor-pointer">
      <h3 className="text-lg font-bold mb-2 text-white line-clamp-1">{review.title}</h3>
      <p className="text-sm text-gray-4 line-clamp-2 mb-auto">{review.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-1"></div>
          <span className="text-xs font-semibold text-gray-4">{review.username}</span>
        </div>
        <span className="text-xs font-light text-gray-4">{review.date}</span>
      </div>
    </div>
  );
};

export default ReviewCard; 