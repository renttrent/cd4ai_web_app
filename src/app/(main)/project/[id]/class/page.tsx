import { PageProps } from "@/types/page";
import { CreateClassForm } from "./_ui/CreateClassForm";
import { notFound } from "next/navigation";

export default function Page({ params }: PageProps<{ id: string }>) {
  const projectId = params.id;
  if (!projectId) notFound();
  return (
    <div>
      <CreateClassForm projectId={projectId} />
    </div>
  );
}
