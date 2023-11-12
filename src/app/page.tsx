import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Dashboard } from "./Dashboard";

export default async function Home() {
  // const session = await getServerSession();
  const session = { user: true };

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <main className="">
      <Dashboard />
    </main>
  );
}
