import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ProfileImage from '../common/ProfileImage';
import IconButton from '../common/IconButton';
import { Check, Pencil, X } from 'lucide-react';
import { userService } from '../../api/user';
import useProfileEdit from '../../hooks/mypage/useProfileEdit';
import { useUserStore } from '../../store/userStore';

interface User {
  id: string;
  nickname: string;
  email: string;
  profileImage: string;
}

const MyPageProfile = () => {
  const user = useUserStore();

  const {
    isEditing,
    editedNickname,
    onChangeNickname,
    tempProfileImage,
    fileInputRef,
    handleProfileImageChange,
    onClickProfileImage,
    onClickEditButton,
    onClickCancelButton,
    onClickCheckButton,
  } = useProfileEdit(user);

  return (
    <div className="flex justify-between gap-2 items-center">
      <div className="flex gap-2 items-center">
        <ProfileImage src={tempProfileImage ? tempProfileImage : user.headImage} onClick={onClickProfileImage} />
        <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleProfileImageChange} />

        <div className="flex flex-col">
          {isEditing ? (
            <input
              type="text"
              value={editedNickname}
              onChange={onChangeNickname}
              className="w-full text-label-md font-bold text-white bg-transparent border-b border-white focus:outline-none"
            />
          ) : (
            <div className="text-label-md font-bold text-white">{user.nickname}</div>
          )}
          <div className="text-label-sm text-gray-400">{user.email}</div>
        </div>
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <IconButton size={30} onClick={onClickCancelButton}>
              <X size={18} />
            </IconButton>

            <IconButton size={30} onClick={onClickCheckButton}>
              <Check size={18} />
            </IconButton>
          </>
        ) : (
          <IconButton size={30} onClick={onClickEditButton}>
            <Pencil size={18} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default MyPageProfile;
