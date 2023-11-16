import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Dashboard } from "./Dashboard";

export default async function Home() {
  // const session = await getServerSession();
  const session = { user: true };

  console.log("test\n\n\n\n");
  console.log(session);
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <main className="">
      <Dashboard />
    </main>
  );
}
