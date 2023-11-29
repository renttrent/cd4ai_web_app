import { Header } from "@/components/custom/Header";
import LatestProjectsView from "@/components/custom/LatestProjects";

export default async function Home() {
  return (
    <div>
      <Header />
      <LatestProjectsView />
    </div>
  );
}
