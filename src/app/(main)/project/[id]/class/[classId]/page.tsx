import { PageProps } from ".next/types/app/layout";
import { ClassDetailView } from "./ClassDetailView";
import { notFound } from "next/navigation";

export default function Page({ params }: PageProps) {
  const classId = params.classId;
  if (!classId) notFound();
  return <ClassDetailView classId={classId} />;
}
