import { cancelTask } from "@/util/task/cancel-task";
import { TaskStatus } from "@/util/task/check-task-status";
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
