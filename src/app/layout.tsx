import type { Metadata } from "next";
import "./globals.css";
import { ServerRoot } from "./_root/ServerRoot";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "CD4AI",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ServerRoot>          
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
</ServerRoot>;
}
