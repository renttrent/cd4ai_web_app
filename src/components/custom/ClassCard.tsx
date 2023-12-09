import Link from "next/link";
import { Class } from "@/types/types";
import { formatDate } from "@/lib/utils";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Card } from "../ui/card";

interface ClassCardProps {
  classItem: Class;
}

const ClassCard = ({ classItem }: ClassCardProps) => {
  return (
    <Card className=" hover:bg-gray-50 mb-4 p-4 flex flex-col min-w-[200px]">
      <div className="font-medium text-sm text-primary">Class</div>

      <div className="flex-grow">
        <Link
          href={`/project/${classItem.project_id}/class/${classItem.id}`}
          className="font-semibold text-lg group flex flex-row gap-2 items-center"
        >
          <span>{classItem.name}</span>
          <span className="invisible group-hover:visible">
            <FaExternalLinkAlt size={14} />
          </span>
        </Link>
        <div>
          <p className="text-base text-gray-800 mt-2 opacity-70">
            {classItem.description}
          </p>
        </div>
        <div className="flex flex-row gap-2 text-sm mt-2 italic text-gray-500">
          <div>Last updated: </div>
          <div>{formatDate(classItem.modification_time)}</div>
        </div>
      </div>
    </Card>
  );
};

export default ClassCard;
