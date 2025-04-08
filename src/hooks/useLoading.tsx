import { useState } from 'react';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loadingIndicator = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/20 z-50">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  };

  return { loadingIndicator, isLoading, setIsLoading };
};

export default useLoading;
