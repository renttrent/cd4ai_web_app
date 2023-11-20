import type { Metadata } from "next";
import "./globals.css";
import { ServerRoot } from "./_root/ServerRoot";

export const metadata: Metadata = {
  title: "CD4AI",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ServerRoot>{children}</ServerRoot>;
}
