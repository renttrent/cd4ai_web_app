"use client";

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
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};
