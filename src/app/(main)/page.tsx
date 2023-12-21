import { Header } from "@/components/custom/Header";
import LatestProjectsView from "@/components/custom/LatestProjects";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default async function Home() {
  return (
    <div>
      <Header />
      <LatestProjectsView />
    </div>
  );
}
