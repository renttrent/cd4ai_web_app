import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { KeywordsExtractionTask, validateTask } from "@/util/task/tasks";
import { array, object, string } from "yup";
import { useUpdateTask } from "../_hooks/use-update-task";
import { queryClient } from "@/util/query-client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useStartTask } from "../_hooks/use-start-task";
import { useToast } from "@/components/ui/use-toast";
import { TaskInfo } from "./TaskInfo";

type KeywordsState = {
  final_keywords: string[];
};

const KeywordsSchema = object({
  final_keywords: array().of(string().required()).required(),
});

export const TaskView = ({ task }: { task: KeywordsExtractionTask }) => {
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

  const { toast } = useToast();
  const { mutateAsync: StartTask } = useStartTask(() => {
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
      data: { result: { filtered_results: data.final_keywords } },
    });
    toast({
      title: "Updated",
      description: "Task results have been updated",
    });
    invalidateTaskList();
    reset(getValues());
  };

  const makeValid = async () => {
    await validateTask(task.id);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border rounded-sm mt-2 p-4"
    >
      <TaskInfo task={selectedTaskData} />
      <div className="w-full border-b my-4" />
      {task.result?.extracted_keywords !== null &&
        task.status == "completed" && (
          <div className="flex flex-row justify-between mt-4 gap-4  divide-x-2">
            <div className=" flex-1 flex flex-col gap-4 p-2 ">
              <div className="text-lg font-bold">
                Extracted Keywords
                {selectedTaskData.result?.extracted_keywords_count && (
                  <span className="ml-1">
                    ({selectedTaskData.result?.extracted_keywords_count})
                  </span>
                )}
              </div>
              <div className="max-w-sm">
                <Input
                  placeholder="search keyword"
                  className="h-6"
                  onChange={(e) => setFilter(e.currentTarget.value ?? "")}
                />
              </div>
              <div className="flex gap-2 flex-wrap  max-h-80 overflow-y-auto no-scrollbar">
                {unselected_extracted_keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    className="w-fit cursor-pointer hover:bg-primary hover:text-white bg-gray-400 hover:bg-gray-500"
                    variant="default"
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
            <div className="flex-1 text-right flex flex-col gap-4 p-2">
              <div className="text-left text-lg font-bold">
                Filtered Keywords
              </div>
              <div className="max-w-sm invisible">
                <Input
                  placeholder="search keyword"
                  className="h-6"
                  onChange={(e) => setFilter(e.currentTarget.value ?? "")}
                />
              </div>
              <div className="flex gap-2 flex-wrap max-h-80 overflow-y-auto">
                {final_words.map((keyword, index) => (
                  <Badge
                    key={index}
                    className="w-fit cursor-pointer hover:bg-red-500 hover:text-white text-white bg-primary"
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
      <div className="mt-2 flex flex-row gap-2 items-center w-fit ml-auto">
        {!isDirty &&
          selectedTaskData.status === "completed" &&
          !!selectedTaskData.result?.filtered_keywords.length && (
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
              Start New Context Window Extraction
            </Button>
          )}

        {!task.valid && (
          <Button
            type="button"
            className="bg-emerald-500 hover:bg-emerald-600"
            onClick={() => makeValid()}
          >
            Make Valid
          </Button>
        )}

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
