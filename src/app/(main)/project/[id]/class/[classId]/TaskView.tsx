import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { formatDate, getFileName } from "@/lib/utils";
import { KeywordsExtractionTask, Task } from "@/util/task/tasks";
import { array, object, string } from "yup";
import { useUpdateTask } from "../_hooks/use-update-task";
import { queryClient } from "@/util/query-client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { d } from "@/util/dayjs";
import { useStartTask } from "../_hooks/use-start-task";
import { ClipLoader, MoonLoader, PulseLoader } from "react-spinners";
import { useCancelTask } from "../_hooks/use-cancel_task";
import { useToast } from "@/components/ui/use-toast";
import { FileBadge } from "@/components/custom/FileBadge";

type KeywordsState = {
  final_keywords: string[];
};

const KeywordsSchema = object({
  final_keywords: array().of(string().required()).required(),
});

export const TaskView = ({
  task,
  taskName,
}: {
  task: KeywordsExtractionTask;
  taskName?: string;
}) => {
  const { handleSubmit, watch, setValue, reset, getValues, formState } =
    useValidatedForm({
      schema: KeywordsSchema,
      defaultValues: {
        final_keywords: task.result?.filtered_keywords ?? [],
      },
    });

  const [filter, setFilter] = useState("");
  const { isDirty } = formState;

  const invalidateTaskList = () => {
    queryClient.invalidateQueries({ queryKey: ["taskList", task.class_id] });
  };
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: cancelTask, isSuccess: isCancelled } = useCancelTask(
    () => {
      invalidateTaskList();
      toast({
        title: "Requested for Cancel",
        description: "Task will be cancelled soon",
      });
    }
  );
  const { toast } = useToast();
  const { mutateAsync: StartTask } = useStartTask(() => {
    // invalidateTaskList();
    queryClient.invalidateQueries({
      queryKey: ["context_windows_extraction_task", task.id],
    });
    toast({
      title: "Started",
      description: "Task has been started",
    });
  });
  const final_words = watch("final_keywords");

  const selectedTaskData = task;

  const unselected_extracted_keywords = (
    selectedTaskData?.result?.extracted_keywords ?? []
  ).filter((word) => !final_words.includes(word) && word.includes(filter));

  const onSubmit = async (data: KeywordsState) => {
    await updateTask({
      taskId: task.id,
      result: { filtered_results: data.final_keywords },
    });
    toast({
      title: "Updated",
      description: "Task results has been updated",
    });
    invalidateTaskList();
    reset(getValues());
  };

  const durationParsed = d
    .duration(d(selectedTaskData.end_time).diff(selectedTaskData.start_time))
    .format("HH:mm:ss");
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border rounded-sm mt-2 p-4"
    >
      <div className="text-2xl">
        Phase 1 <span className="font-bold">Extraction</span>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col font-medium text-lg">
          {task.name && <span>TaskName : {task.name}</span>}
          <div>TaskId :{task.id}</div>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <div>Status {selectedTaskData?.status}</div>
          {}
          {selectedTaskData?.status === "in progress" && (
            <>
              <MoonLoader size={30} speedMultiplier={0.8} color="green" />{" "}
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
          {selectedTaskData.status === "completed" &&
            selectedTaskData.result?.filtered_keywords.length && (
              <Button
                type="button"
                onClick={() =>
                  StartTask({
                    classId: task.class_id,
                    data: {
                      type: "context windows extraction",
                      parent_id: task.id,
                    },
                  })
                }
                variant="default"
              >
                Start New Context window Extraction
              </Button>
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
        <div>Estimated Time -{durationParsed}</div>
        {selectedTaskData?.end_time && (
          <div>Ended at - {formatDate(selectedTaskData?.end_time ?? "")}</div>
        )}
      </div>
      <div className="flex flex-row justify-between">
        <div>
          <div className="text-lg">Initial Keywords: </div>
          <div className="flex flex-row gap-2">
            {selectedTaskData?.input.init_keywords.map((keyword, index) => (
              <Badge key={index}>{keyword}</Badge>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg">Considered Files:</div>
          <div>
            {selectedTaskData?.input.files_to_consider.map((file, index) => (
              <div key={index} className="flex flex-row gap-2 items-center">
                <FileBadge
                  name={getFileName(file.file_path) ?? ""}
                  path={file.file_path}
                />
                {/* <div className="font-bold">{getFileName(file.file_path)}</div> */}
                {file.column_name && (
                  <div className="">
                    Selected Column:
                    <span className="font-bold text-violet-500">
                      {" " + file.column_name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {task.result?.extracted_keywords !== null && (
        <div className="flex flex-row justify-between mt-4 gap-4">
          <div className=" flex-1 flex flex-col gap-4">
            <div className="text-lg">Filtered Extracted Keywords: </div>
            <div className="max-w-sm">
              <Input
                className="h-6"
                onChange={(e) => setFilter(e.currentTarget.value ?? "")}
              />
            </div>
            <div className="flex gap-2 flex-wrap min-w-[1px]">
              {unselected_extracted_keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  className="w-fit cursor-pointer hover:bg-violet-500 hover:text-white"
                  variant="secondary"
                  onClick={() =>
                    setValue("final_keywords", [...final_words, keyword], {
                      shouldDirty: true,
                    })
                  }
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex-1 text-right flex flex-col gap-2">
            <div className="text-lg">Filtered Keywords: </div>
            <div className="flex gap-2 flex-wrap">
              {final_words.map((keyword, index) => (
                <Badge
                  key={index}
                  className="w-fit cursor-pointer hover:bg-red-500 hover:text-white"
                  variant="secondary"
                  onClick={() =>
                    setValue(
                      "final_keywords",
                      final_words.filter((word) => word !== keyword),
                      {
                        shouldDirty: true,
                      }
                    )
                  }
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="text-right mt-2">
        {isDirty && (
          <Button
            type="submit"
            className="bg-yellow-400 text-black hover:text-white"
          >
            Save Changes
          </Button>
        )}
      </div>
    </form>
  );
};