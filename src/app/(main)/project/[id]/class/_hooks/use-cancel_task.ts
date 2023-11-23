import { cancelTask } from "@/util/keyword-extraction/cancel-task";
import { TaskStatus } from "@/util/keyword-extraction/check-task-status";
import { useMutation } from "@tanstack/react-query";

export const useCancelTask = (onSuccess: (data: boolean) => void) => {
  const q = useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      return cancelTask(taskId);
    },
    onSuccess,
  });

  return q;
};
