import { PageProps } from ".next/types/app/layout";
import { CreateClassForm } from "./_ui/CreateClassForm";
import { notFound } from "next/navigation";

export default function Page({ params }: PageProps) {
  const projectId = params.id;
  if (!projectId) notFound();
  return (
    <div>
      <CreateClassForm projectId={projectId} />
    </div>
  );
}
