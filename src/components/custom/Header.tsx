import { AiFillFileAdd } from "react-icons/ai";

export const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-4xl font-medium">{"Hi _!"}</div>
      <button className="flex gap-2 items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
        <AiFillFileAdd />
        <span>Add Project</span>
      </button>
    </div>
  );
};