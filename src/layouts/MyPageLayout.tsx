import { Outlet, useNavigate } from 'react-router';
import MyPageProfile from '../components/my-page/MyPageProfile';
import MyPageTap from '../components/my-page/MyPageTap';
import { useUserStore } from '../store/userStore';
import { userService } from '../api/user';
import { ROUTES } from '../router/routes';
import useLoading from '../hooks/useLoading';
import { useQuery } from '@tanstack/react-query';

const MyPageLayout = () => {
  const user = useUserStore();

  useQuery({
    queryKey: ['user', user.id],
    queryFn: async () => {
      const response = await userService.getProfile(user.id);
      return response.data;
    },
    onSuccess: (data) => {
      user.setUser(data);
    },
    enabled: Boolean(user.id),
    staleTime: 60 * 1000,
  });

  const navigate = useNavigate();

  const { isLoading, setIsLoading, loadingIndicator } = useLoading();

  const handleDeleteAccount = async () => {
    if (confirm('정말 탈퇴하시겠습니까?')) {
      setIsLoading(true);
      await userService.deleteAccount(user.id);
      setIsLoading(false);
      user.clearUser();
      navigate(ROUTES.SIGN_UP);
    }
  };

  return (
    <div className="flex gap-4 min-h-screen mb-[3.75rem] pt-4">
      {isLoading && loadingIndicator()}

      {/* 왼쪽 사이드바 */}
      <div className="max-w-4/12 flex-4/12 flex flex-col gap-4 items-start">
        <div className="w-full flex flex-col gap-4 h-fit bg-gray-7 p-6 rounded-[10px]">
          <MyPageProfile />
          <div className="w-full h-[1px] bg-gray-4" />
          <MyPageTap />
        </div>

        <button className="text-label-md text-gray-6 ml-4" onClick={handleDeleteAccount}>
          회원탈퇴
        </button>
      </div>

      {/* 오른쪽 컨텐츠 영역 */}
      <div className="flex-9/12 p-8 bg-gray-7 rounded-[10px]">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default MyPageLayout;
