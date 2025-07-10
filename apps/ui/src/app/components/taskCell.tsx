export const TaskCell = ({ name, index }: { name?: string; index: number }) => {
  return (
          <div className="flex">
      <div className="border border-black py-5 px-4 flex w-[300px] justify-center cursor-pointer">
              
      <div className="font-bold">{index}</div>

      {name}
    </div>
          </div>
  );
};
