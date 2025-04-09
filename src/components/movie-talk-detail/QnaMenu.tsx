import { Edit, Trash } from 'lucide-react';

interface QnaMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const QnaMenu = ({ onEdit, onDelete }: QnaMenuProps) => {
  console.log('QnaMenu 렌더링');
  
  return (
    <div className="absolute right-0 mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-10">
      <ul className="py-1">
        <li>
          <button 
            onClick={onEdit} 
            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
          >
            <Edit size={16} className="mr-2" />
            수정하기
          </button>
        </li>
        <li>
          <button 
            onClick={onDelete} 
            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600"
          >
            <Trash size={16} className="mr-2" />
            삭제하기
          </button>
        </li>
      </ul>
    </div>
  );
};

export default QnaMenu; 