import { Navigation } from "@/components/custom/Navigation";
import { Header } from "@/components/custom/Header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row top-0 left-0 w-screen h-screen">
      <Navigation />
      <section className="w-full overflow-y-auto p-10">{children}</section>
    </div>
  );
}
