// components/genre-recommendations/SectionHeader/SectionHeader.tsx
interface SectionHeaderProps {
    title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
    return (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">{title}</h2>
            <button className="text-sm text-gray-5 flex items-center">
                더보기
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
};

export default SectionHeader;