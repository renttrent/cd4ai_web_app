import { Class } from "@/types/types";
import { updateClass } from "@/util/classes/classes";
import { Task, updateTask } from "@/util/task/tasks";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTask = () => {
  const q = useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: {
        name?: string;
        result?: {
          filtered_results: string[];
          manual_added_results?: string[];
        };
      };
    }) => {
      return updateTask(taskId, data);
    },
  });

  return q;
};
