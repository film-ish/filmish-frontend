import { useEffect, useRef, useState } from 'react';
import { userService } from '../../api/user';
import { UserState } from '../../store/userStore';

const useProfileEdit = (user: UserState) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');

  useEffect(() => {
    setEditedNickname(user.nickname);
  }, [user.nickname]);

  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 10) {
      setEditedNickname(e.target.value.trim());
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
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
      fileInputRef.current.click();
    }
  };

  const onClickEditButton = async () => {
    setIsEditing(true);
    setTempProfileImage(null);
    setEditedNickname(user.nickname);
  };

  const onClickCancelButton = () => {
    setIsEditing(false);
    setTempProfileImage(null);
    setEditedNickname(user.nickname);
  };

  const onClickCheckButton = async () => {
    try {
      const editedFile = fileInputRef.current?.files?.[0];
      await userService.updateProfile(user.id, editedNickname, editedFile);

      user.setUser({
        id: user.id,
        nickname: editedNickname,
        email: user.email,
        headImage: editedFile ? URL.createObjectURL(editedFile) : user.headImage,
      });

      setIsEditing(false);
    } catch (err) {
      alert('프로필 업데이트에 실패했습니다.');
      console.error('Profile update failed:', err);
    }
  };

  return {
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
  };
};

export default useProfileEdit;
