interface MenuProps {
  hasRightSpace?: boolean;
  items: { name: string; onClick: () => void }[];
  closeMenu: () => void;
}

const Menu = ({ hasRightSpace = true, items, closeMenu }: MenuProps) => {
  return (
    <>
      <div className="z-10 fixed top-0 left-0 w-screen h-screen" onClick={closeMenu} />
      <div
        className={
          'absolute flex flex-col bg-white rounded-[10px] overflow-hidden ' + (hasRightSpace ? 'right-6' : 'right-1')
        }
        style={{}}>
        {items.map((item) => (
          <button
            key={item.name}
            className="shrink-0 z-20 w-fit whitespace-nowrap hover:bg-gray-2 py-2 px-4 text-gray-8"
            onClick={item.onClick}>
            {item.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default Menu;
