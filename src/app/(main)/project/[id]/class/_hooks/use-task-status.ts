import { TaskStatus, checkTaskStatus } from "@/util/task/check-task-status";
import { useMutation } from "@tanstack/react-query";

export const useTaskStatus = (onSuccess: (data: TaskStatus) => void) => {
  const q = useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      return checkTaskStatus(taskId);
    },
    onSuccess,
  });

  return q;
};
