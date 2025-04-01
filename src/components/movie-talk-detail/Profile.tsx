interface ProfileProps {    
  name: string;
  profileImage?: string;
}

const Profile = ({ name, profileImage }: ProfileProps) => {
  return (
    <div className="flex-1 flex-col mb-4 bg-white/10 backdrop-blur-xl rounded-lg justify-items-center content-center">
      <div className="w-40 h-40 bg-gray-4 rounded-lg mb-3">
        {profileImage && (
          <img src={profileImage} alt={name} className="w-full h-full object-cover rounded-lg" />
        )}
      </div>
      <h2 className="text-[3rem] font-['HakgyoansimChulseokbuTTF-B']">{name}</h2>
    </div>
  );
};

export default Profile; 