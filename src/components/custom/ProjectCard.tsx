import { Project } from "@/types/types";
import Link from "next/link";
import React from "react";
import { Card } from "../ui/card";
import { Paperclip } from "lucide-react";
import { ConfirmPopover } from "./ConfirmPopover";
import { Trash } from "lucide-react";
import { UpdateProjectButton } from "./UpdateProjectModal";

interface ProjectCardProps {
  project: Project;
  onDeletePress?: () => void;
  onEditPress?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDeletePress, onEditPress }) => {
  if (!project || !project.name || !project.description || !project.files) {
    // Handle : project or its properties are undefined
    return null;
  }

  return (
    <Card className="flex flex-col gap-1 p-4 hover:bg-accent">
      <div className="font-medium text-sm">Project <span className="font-bold text-sm text-primary">({project.lang.toUpperCase()})</span></div>
      <div className="flex justify-between items-center">
        <Link href={`/project/${project.id}`} key={project.id} className="cursor-pointer">
          <div className="font-bold text-md">{project.name}</div>
        </Link>
        <div className="flex gap-4 items-center">
          <div className="hidden sm:flex gap-2 text-primary">
            <UpdateProjectButton project={project} />
          </div>
          <ConfirmPopover
            variant="destructive"
            title="Are you sure?"
            description="Deleting a project will also delete all classes and tasks associated with it"
            onConfirm={onDeletePress}
          >
            <Trash color="red" size={16} />
          </ConfirmPopover>
          
        </div>
      </div>
      <div className="flex gap-0.5 items-center">
            <Paperclip size="10px" />
            <div>
              {project.files.length > 1 ? project.files.length + " files" : project.files.length > 0 ? "1 file" : null}
            </div>
      </div>
      <div className="text-sm line-clamp-3 text-ellipsis">
        {project.description}
      </div>
    </Card>
  );
};

export default ProjectCard;
