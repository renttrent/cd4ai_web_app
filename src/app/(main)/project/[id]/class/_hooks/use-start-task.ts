import { StartTaskRequest, startTask } from "@/util/task/start-task";
import { useMutation } from "@tanstack/react-query";

export const useStartTask = (
  onSuccess: (t: { task_id: string | null }) => void
) => {
  const q = useMutation({
    mutationFn: async ({
      classId,
      data,
    }: {
      classId: string;
      data: StartTaskRequest;
    }) => {
      return startTask(classId, 'fast',data);
    },
    onSuccess,
  });

  return q;
};
