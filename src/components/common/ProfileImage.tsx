interface ProfileImageProps {
  src: string;
  size?: number;
}

const ProfileImage = ({ src, size = 36 }: ProfileImageProps) => {
  return (
    <div
      className="flex items-center justify-center relative rounded-full aspect-square overflow-hidden bg-white"
      style={{ width: `${size}px` }}>
      <img
        className="object-cover w-full h-full"
        src={src ? src : '/profile.png'}
        alt="profile image"
      />
    </div>
  );
};

export default ProfileImage;
