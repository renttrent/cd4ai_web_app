import { Task } from "@/util/task/tasks";
import { TaskName } from "./TaskName";
import { cn, formatDate, getFileName } from "@/lib/utils";
import { MoonLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { d } from "@/util/dayjs";
import { queryClient } from "@/util/query-client";
import { useCancelTask } from "../_hooks/use-cancel_task";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { FileBadge } from "@/components/custom/FileBadge";
import { Loader2 } from "lucide-react";

export const TaskInfo = ({ task }: { task: Task }) => {
  const selectedTaskData = task;

  const durationParsed = d
    .duration(d(selectedTaskData.end_time).diff(selectedTaskData.start_time))
    .format("HH:mm:ss");

  const { toast } = useToast();
  const { mutateAsync: cancelTask, isSuccess: isCancelled } = useCancelTask(
    () => {
      queryClient.invalidateQueries({ queryKey: ["taskList", task.class_id] });
      toast({
        title: "Requested for Cancel",
        description: "Task will be cancelled soon",
      });
    }
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl">
        <span className="font-bold">{task.type}</span>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col font-medium text-lg">
          {task.name && (
            <div className="flex gap-1 items-center">
              <span>Task Name :</span> <TaskName task={task} />
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex flex-row gap-4 items-center font-bold",
            selectedTaskData.status == "in progress"
              ? "text-yellow-500"
              : selectedTaskData.status == "completed"
              ? "text-green-500"
              : "text-red-500"
          )}
        >
          <div>{selectedTaskData?.status}</div>

          {selectedTaskData?.status === "in progress" && (
            <>
              <Loader2 className="animate-spin" />
              {!isCancelled && (
                <Button
                  type="button"
                  onClick={() => cancelTask({ taskId: task.id })}
                  variant="destructive"
                >
                  Cancel
                </Button>
              )}
            </>
          )}

          {selectedTaskData?.valid && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full">
              Valid
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between text-sm my-4 italic">
        <div>Started at - {formatDate(selectedTaskData?.start_time ?? "")}</div>
        <div>Estimated Time - {durationParsed}</div>
        {selectedTaskData?.end_time && (
          <div>Ended at - {formatDate(selectedTaskData?.end_time ?? "")}</div>
        )}
      </div>
      <div className="flex flex-row justify-between flex-wrap">
        <div className="flex-1 ">
          <div className="text-lg font-bold">
            {selectedTaskData.type == "keywords extraction"
              ? "Initial Keywords"
              : "Filtered Keywords"}
          </div>
          <div className="flex flex-row gap-2 flex-wrap">
            {(selectedTaskData.type == "keywords extraction"
              ? selectedTaskData?.input.init_keywords
              : selectedTaskData.input.filtered_keywords
            ).map((keyword, index) => (
              <Badge key={index}>{keyword}</Badge>
            ))}
          </div>
        </div>
        <div className="flex-1 px-2">
          <div className="text-lg font-bold">Considered Files</div>
          <div className="flex flex-col gap-2">
            {selectedTaskData.input.files_to_consider.map((file, index) => (
              <div key={index} className="flex flex-row gap-2 flex-wrap">
                <FileBadge
                  name={getFileName(file.file_path) ?? ""}
                  path={file.file_path}
                />

                {file.column_name && (
                  <div className="text-sm">
                    Selected column:
                    <span className="font-bold text-primary">
                      {" " + file.column_name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
