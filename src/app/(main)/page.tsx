import { Header } from "@/components/custom/Header";
import LatestProjectsView from "@/components/custom/LatestProjects";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  // if (!session?.user) {
  //   redirect("/auth/login");
  // }
  return (
    <div>
      <Header />
      <LatestProjectsView />
    </div>
  );
}
