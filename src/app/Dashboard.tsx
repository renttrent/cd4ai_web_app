"use client";
import { useState } from "react";
import { Header } from "@/components/custom/Header";
import { LatestProjectsView } from "@/components/custom/LatestProjects";
import { Navigation } from "@/components/custom/Navigation";
import { useSession } from "next-auth/react";
import { Project } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/util/user/get-user";
import { getProjects } from "@/util/projects/projects";
import ProjectForm from "@/components/custom/ProjectForm";

export const Dashboard = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const session = useSession();
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectFormVisible, setProjectFormVisible] = useState(false);

  const openProjectForm = () => {
    setProjectFormVisible(true);
  };

  const closeProjectForm = () => {
    setProjectFormVisible(false);
  };
  return (
    <div className="flex flex-row top-0 left-0 w-screen h-screen">
      <Navigation />
      <section className="w-full overflow-y-auto p-10">
        <Header onAddProjectClick={openProjectForm} />
        {isProjectFormVisible && <ProjectForm onClose={closeProjectForm} />}
        <LatestProjectsView />
      </section>
    </div>
  );
};
