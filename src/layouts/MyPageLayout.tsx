import { Outlet } from 'react-router';
import MyPageProfile from '../components/my-page/MyPageProfile';
import MyPageTap from '../components/my-page/MyPageTap';
import { useUserStore } from '../store/userStore';

interface User {
  userId: number;
  nickname: string;
  email: string;
  image?: string;
}

const MyPageLayout = () => {
  const user = useUserStore();

  return (
    <div className="flex gap-4 min-h-screen mb-[3.75rem]">
      {/* 왼쪽 사이드바 */}
      <div className="flex-4/12 flex flex-col gap-4 h-fit bg-gray-7 p-6 rounded-[10px]">
        <MyPageProfile user={user} />
        <div className="w-full h-[1px] bg-gray-4" />
        <MyPageTap />
      </div>

      {/* 오른쪽 컨텐츠 영역 */}
      <div className="flex-9/12 p-8 bg-gray-7 rounded-[10px]">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default MyPageLayout;
