import { PageContainer } from "@/components/ui/PageContainer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <div className="flex-col flex flex-1 w-full justify-center items-center">
        <div className='w-full max-w-lg p-4'>{children}</div>
      </div>
    </PageContainer>
  );
}
