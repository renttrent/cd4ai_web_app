import Link from "next/link";
import { Class } from "@/types/types";
import { formatDate } from "@/lib/utils";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Pen, Trash } from "lucide-react";
import { ConfirmPopover } from "./ConfirmPopover";

interface ClassCardProps {
  classItem: Class;
  onDeletePress?: () => void;
  onEditPress?: () => void;
}

const ClassCard = ({
  classItem,
  onDeletePress,
  onEditPress,
}: ClassCardProps) => {
  return (
    <Card className=" hover:bg-gray-50 mb-4 p-4 flex flex-col min-w-[200px]">
      <div className="flex gap-2 justify-between">
        <div className="font-medium text-sm text-primary">Class</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onEditPress}
            className="flex gap-1"
          >
            <Pen size={14} />
            <span>Edit</span>
          </Button>
          <ConfirmPopover
            variant="destructive"
            title="Are you sure?"
            description="Deleting a class will also delete all tasks associated with it"
            onConfirm={onDeletePress}
          >
            <Button variant="destructive" className="flex gap-1">
              <Trash size={14} />
              <span>Delete</span>
            </Button>
          </ConfirmPopover>
        </div>
      </div>
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
