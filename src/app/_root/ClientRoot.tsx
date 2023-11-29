"use client";

import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/util/query-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useState } from "react";

export interface ClientRootParams extends PropsWithChildren<{}> {
  locale: string;
}

export const ClientRoot = ({
  children,
  session,
}: { session?: Session | null } & PropsWithChildren) => {
  const [q] = useState(queryClient);

  return (
    <SessionProvider session={session}>
      <Toaster />
      <QueryClientProvider client={q}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};
