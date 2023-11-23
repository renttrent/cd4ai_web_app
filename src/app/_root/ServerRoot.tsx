import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { ClientRoot } from "./ClientRoot";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const ServerRoot = async ({ children }: PropsWithChildren) => {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <meta name="charset" content="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
      </head>
      <body
        className={cn(
          "min-h-screen  bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ClientRoot session={session}>{children}</ClientRoot>
      </body>
    </html>
  );
};
