import { useValidatedForm } from "@/hooks/use-validated-form";
import { RenameTask, Task } from "@/util/task/tasks";
import { useUpdateTask } from "../_hooks/use-update-task";
import { Input } from "@/components/ui/input";
import { object, string } from "yup";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { queryClient } from "@/util/query-client";
import { useMutation } from "@tanstack/react-query";

export const TaskName = ({ task }: { task: Task }) => {
  const { register, handleSubmit } = useValidatedForm({
    schema: object({
      name: string().required(),
    }),
    defaultValues: {
      name: task.name,
    },
  });

  const { mutateAsync: renameTask, isPending } = useMutation({
    mutationFn: async ({ taskId, name }: { taskId: string; name: string }) => {
      return await RenameTask(taskId, name);
    },
  });

  const onSubmit = async (data: { name?: string }) => {
    await renameTask({
      taskId: task.id,
      name: data.name!,
    });
    if (task.type === "keywords extraction") {
      queryClient.invalidateQueries({ queryKey: ["taskList", task.class_id] });
    } else if (task.type === "context windows extraction") {
      queryClient.invalidateQueries({
        queryKey: ["context_windows_extraction_task", task.parent_id],
      });
      queryClient.invalidateQueries({ queryKey: ["task", task.id] });
    }
    setIsEditing(false);
  };
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div>
      {isEditing ? (
        <form className="font-bold" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-2 items-center">
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              size={40}
              className="h-9"
              {...register("name")}
            />
            <LoadingButton
              disabled={isPending}
              isLoading={isPending}
              size="sm"
              type="button"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      ) : (
        <div className="flex gap-2 items-center">
          <div>{task.name}</div>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            <Edit />
          </Button>
        </div>
      )}
    </div>
  );
};
