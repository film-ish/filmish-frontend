import { ChangeEvent, useRef, useState } from 'react';
import ProfileImage from '../common/ProfileImage';
import IconButton from '../common/IconButton';
import { Check, Pencil } from 'lucide-react';
import { userService } from '../../api/user';

interface User {
  userId: string;
  nickname: string;
  email: string;
  profileImage: string;
}

interface MyPageProfileProps {
  user: User;
}

const MyPageProfile = ({ user }: MyPageProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname);

  const inputRef = useRef<HTMLInputElement>(null);
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);

  const validateImageLoad = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setTempProfileImage(img.src);
        resolve(true);
      };
      img.onerror = () => resolve(false);
    });
  };

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files[0];

    if (!file.type.includes('image')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    if (file.size / (1024 * 1024) >= 5) {
      alert('5mb 이하의 파일만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    if (!(await validateImageLoad(file))) {
      alert('손상된 파일입니다. 파일을 확인해주세요.');
      e.target.value = '';
      return;
    }
  };

  const onClickProfileImage = () => {
    if (isEditing) {
      inputRef.current.click();
    }
  };

  const onClickEditButton = async () => {
    if (isEditing) {
      try {
        await userService.updateProfile(user.userId, nickname, inputRef.current?.files?.[0]);
        setIsEditing(false);
      } catch (err) {
        alert('프로필 업데이트에 실패했습니다.');
        console.error('Profile update failed:', err);
      }
    } else {
      setIsEditing(true);
      setTempProfileImage(null);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <ProfileImage src={tempProfileImage ? tempProfileImage : user.profileImage} onClick={onClickProfileImage} />
        <input ref={inputRef} hidden type="file" accept="image/*" onChange={handleProfileImageChange} />

        <div className="flex flex-col">
          {isEditing ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="text-label-xl font-bold text-white bg-transparent border-b border-white focus:outline-none"
            />
          ) : (
            <div className="text-label-xl font-bold text-white">{user.nickname}</div>
          )}
          <div className="text-label-sm text-gray-400">{user.email}</div>
        </div>
      </div>

      <IconButton size={30} onClick={onClickEditButton}>
        {!isEditing ? <Pencil size={18} /> : <Check size={18} />}
      </IconButton>
    </div>
  );
};

export default MyPageProfile;
