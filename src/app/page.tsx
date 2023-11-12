import { getServerSession } from "next-auth";
import Image from "next/image";
import { HomeClient } from "./Home";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();
  return (
    <main className="">
      <HomeClient />
      {!session?.user ? (
        <Link href="/auth/login">Login </Link>
      ) : (
        <div>
          <Link href="api/auth/signout">signout</Link>
        </div>
      )}
    </main>
  );
}
