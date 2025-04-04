import { User } from 'lucide-react';

interface ProfileImageProps {
  src: string;
  size?: number;
  onClick?: () => void;
}

const ProfileImage = ({ src, size = 36, onClick }: ProfileImageProps) => {
  return (
    <div
      onClick={onClick}
      className="shrink-0 flex items-center justify-center relative rounded-full aspect-square overflow-hidden bg-gray-4"
      style={{ width: `${size}px` }}>
      {src ? (
        <img className="object-cover w-full h-full" src={src ? src : '/profile.png'} alt="profile image" />
      ) : (
        <User />
      )}
    </div>
  );
};

export default ProfileImage;
