import { PropsWithChildren } from "react";

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return <div className="min-h-screen  flex flex-col">{children}</div>;
};
