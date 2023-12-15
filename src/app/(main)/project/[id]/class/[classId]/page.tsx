import { PageProps } from "@/types/page";
import { ClassDetailView } from "./ClassDetailView";
import { notFound } from "next/navigation";

export default function Page({ params }: PageProps<{ classId: string }>) {
  const classId = params.classId;
  if (!classId) notFound();
  return <ClassDetailView classId={classId} />;
}
