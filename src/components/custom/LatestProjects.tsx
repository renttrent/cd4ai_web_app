"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "./ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/util/projects/projects";
import { BarLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import Link from "next/link";
import { Project } from "@/types/types";

export const LatestProjectsView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: projects,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const filteredProjects = (projects ?? []).filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="p-2 border-2 rounded-md focus:outline-none focus:border-violet-500 focus-visible:border-violet-500"
          style={{ width: "31.5%", lineHeight: "2%" }}
        />
      </div>
      <div className="text-xl mt-8">Your latest projects</div>
      <div className={`${isLoading ? "hidden" : "border mt-2"}`} />
      {isLoading && (
        <div className="text-violet-500 bg-violet-100 rounded-xl mt-1">
          <BarLoader width="100%" color={colors.violet[500]} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-10 mt-4">
        {filteredProjects.map((project) => (
          <Link href={`/project/${project._id}`} key={project._id}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestProjectsView;
