"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "./ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/util/projects/projects";
import { BarLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import Link from "next/link";

export const LatestProjectsView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const filteredProjects = (projects ?? []).filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="search..."
          className="p-2 border-2 rounded-md focus:outline-none focus:border-violet-500 focus-visible:border-violet-500"
          style={{ width: "31.5%", lineHeight: "2%" }}
        />
      </div>
      <div className="flex   justify-between flex-wrap items-center">
        <div className="text-xl font-bold">Your Projects</div>
        <span className="opacity-70"> Total count: {projects?.length}</span>
      </div>
      <div className={`${isLoading ? "hidden" : "border"}`} />
      {isLoading && (
        <div className="bg-primary rounded-xl">
          <BarLoader width="100%" color={colors.violet[500]} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-10 ">
        {filteredProjects.map((project) => (
          <Link href={`/project/${project.id}`} key={project.id}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestProjectsView;
