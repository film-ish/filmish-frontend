interface ProfileImageProps {
  src: string;
  size?: number;
  onClick?: () => void;
}

const ProfileImage = ({ src, size = 32, onClick }: ProfileImageProps) => {
  return (
    <div
      onClick={onClick}
      className="shrink-0 flex items-center justify-center relative rounded-full aspect-square overflow-hidden bg-gray-4"
      style={{ width: `${size}px` }}>
      <img className="object-cover w-full h-full" src={src ? src : '/knockknock.png'} alt="profile image" />
    </div>
  );
};

export default ProfileImage;
