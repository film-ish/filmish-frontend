import React from 'react';
import MyPageRatingList from '../../components/my-page/MyPageRatingList';

const RatingsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">평점 및 코멘트</h1>
      <MyPageRatingList />
    </div>
  );
};

export default RatingsPage;
