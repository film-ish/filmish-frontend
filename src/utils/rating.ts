const formatRating = (rating: number) => {
  return rating % 1 === 0 ? rating.toFixed(1) : rating.toFixed(2);
};

export default formatRating;
