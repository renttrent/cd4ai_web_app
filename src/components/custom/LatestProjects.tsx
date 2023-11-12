import { ProjectCard } from "./ProjectCard";

export const LatestProjectsView = () => {
  return (
    <div className="mt-10">
      <div className="text-xl">Your latest projects</div>
      <div className="border" />
      <div className="grid grid-cols-3 gap-10 mt-10">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </div>
  );
};
