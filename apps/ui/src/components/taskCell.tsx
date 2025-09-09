export const TaskCell = ({
  name,
  index,
  onClick,
}: {
  name?: string;
  index: number;
  onClick: () => void;
  }) => {
  
  return (
    <div className="flex" onClick={onClick}>
      <div className="border border-black py-5 px-4 flex w-[300px] justify-center cursor-pointer">
        <div className="font-bold">{index}</div>

        {name}
      </div>
    </div>
  );
};
