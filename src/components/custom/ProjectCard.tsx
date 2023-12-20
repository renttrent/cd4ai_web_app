import { Project } from "@/types/types";
import React from "react";
import { AiFillFolderOpen } from "react-icons/ai";
import { FileBadge } from "./FileBadge";
import { Card } from "../ui/card";
import { Clipboard, Paperclip } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProject , deleteProject} from "@/util/projects/projects";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  if (!project || !project.name || !project.description || !project.files) {
    // Handle : project or its properties are undefined
    return null;
  }
  const handleDelete = async (projectId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project? All associated classes and tasks will be permanently removed.");
    if (confirmDelete) {
      try {
        useQuery({
          queryKey: ["deleteProject", projectId],
          queryFn: async () => await deleteProject(projectId),
        });
        // Handle state update or refetch projects after deletion
        // For example:        // refetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };
  return (
    <Card className="flex flex-col gap-1 p-4 hover:bg-gray-50">
      <div className="font-medium text-sm text-primary">Project <span className="font-bold text-sm">({project.lang.toUpperCase()})</span></div>
      <div className="flex justify-between">
        <div className="font-bold text-md">{project.name}</div>
        <div className="flex gap-2">
        <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete(project.id);
            }}
          >
            Delete
          </button>
        </div>
        <div className="text-sm opacity-70">
          <div className="flex gap-0.5 items-center">
            <Paperclip size="10px" />
            <div>
              {project.files.length
                ? project.files.length == 1
                  ? "1 file"
                  : `{project.files.length} files`
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500 line-clamp-3 text-ellipsis">
        {project.description}
      </div>
    </Card>
  );
};

export default ProjectCard;
