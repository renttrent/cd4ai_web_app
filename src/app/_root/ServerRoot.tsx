import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { ClientRoot } from "./ClientRoot";

const inter = Inter({ subsets: ["latin"] });

export const ServerRoot = async ({ children }: PropsWithChildren) => {
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
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ClientRoot>
        {children}
        </ClientRoot>
      </body>
    </html>
  );
};
