import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Dashboard } from "./Dashboard";

export default async function Home() {
  const session = await getServerSession();

  console.log(session);
  if (!session?.user) {
    redirect("/auth/login");
  }

  console.log(process.env.NEXT_PUBLIC_API_URL);
  console.log(process.env.NEXTAUTH_URL);
  console.log(process.env.SECRET);

  return (
    <main className="">
      <Dashboard />
    </main>
  );
}
