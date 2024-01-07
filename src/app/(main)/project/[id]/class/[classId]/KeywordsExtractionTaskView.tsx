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
import {
  SortState,
  Sorter,
  getSortingFunction,
} from "@/components/custom/Sorter";
import { RecommendKeywords } from "../_ui/RecommendKeywords";
import { AddBadge } from "../_ui/AddBadge";

type KeywordsState = {
  final_keywords: string[];
  manual_keywords?: string[];
};

const KeywordsSchema = object({
  final_keywords: array().of(string().required()).required(),
  manual_keywords: array().of(string().required()),
});

export const KeywordsExtractionTaskView = ({
  task,
}: {
  task: KeywordsExtractionTask;
}) => {
  const { handleSubmit, watch, setValue, reset, getValues, formState } =
    useValidatedForm({
      schema: KeywordsSchema,
      defaultValues: {
        final_keywords: task.result?.filtered_keywords ?? [],
        manual_keywords: task.result?.manual_keywords ?? [],
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

  const manual_words = watch("manual_keywords");
  const selectedTaskData = task;

  const [sort, setSort] = useState<SortState>();

  const unselected_extracted_keywords = (
    selectedTaskData?.result?.extracted_keywords ?? []
  )
    .filter((word) => !final_words.includes(word) && word.includes(filter))
    .sort(getSortingFunction(sort));

  const onSubmit = async (data: KeywordsState) => {
    await updateTask({
      taskId: task.id,
      data: {
        result: {
          filtered_results: data.final_keywords,
          manual_added_results: data.manual_keywords,
        },
      },
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
    toast({
      title: "Validated",
      description: "Task has been validated",
    });
    invalidateTaskList();
    reset(getValues());
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-4 rounded-sm mt-2 p-4"
    >
      <TaskInfo task={selectedTaskData} />
      {task.result?.extracted_keywords !== null &&
        task.status == "completed" && (
          <div className="flex flex-row justify-between mt-4 gap-4">
            <div className=" flex-1 flex flex-col gap-4 p-2 ">
              <div className="text-lg font-bold">
                {`Extracted Keywords (${task.result?.extracted_keywords.length})`}
              </div>
              <div className="w-full flex items-center gap-2">
                <Input
                  placeholder="Search Keyword"
                  className="h-6"
                  onChange={(e) => setFilter(e.currentTarget.value ?? "")}
                />
                <Sorter onSort={setSort} />
              </div>
              <div className="flex gap-2 flex-wrap  max-h-80 overflow-y-auto no-scrollbar border rounded-md p-2 hover:shadow-md">
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
              <div className="">
                <RecommendKeywords
                  onAccept={(data) => {
                    const set = new Set([...(final_words ?? []), ...data]);
                    setValue("final_keywords", Array.from(set), {
                      shouldDirty: true,
                    });
                  }}
                  taskId={task.id}
                />
              </div>
              {final_words.length > 0 && (
                <div className="flex gap-2 flex-wrap max-h-80 overflow-y-auto no-scrollbar rounded-md border p-2 hover:shadow-md">
                  {final_words.map((keyword, index) => (
                    <Badge
                      key={index}
                      className="w-fit cursor-pointer hover:bg-red-500 hover:text-white text-black bg-primary"
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
              )}
              <div className="text-left text-lg font-bold">Manual Keywords</div>
              <div className="flex gap-2 flex-wrap max-h-80 overflow-y-auto no-scrollbar rounded-md border p-2 hover:shadow-md">
                {(manual_words ?? []).map((keyword, index) => (
                  <Badge
                    key={index}
                    className="w-fit cursor-pointer hover:bg-red-500 hover:text-white bg-primary"
                    variant="secondary"
                    onClick={() =>
                      setValue(
                        "manual_keywords",
                        (manual_words ?? []).filter((word) => word !== keyword),
                        {
                          shouldDirty: true,
                        }
                      )
                    }
                  >
                    {keyword}
                  </Badge>
                ))}
                <AddBadge
                  onAdd={(word) =>
                    setValue(
                      "manual_keywords",
                      [...(manual_words ?? []), word],
                      { shouldDirty: true }
                    )
                  }
                />
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
            variant="outline"
            className="border-green-800 text-green-800 border-2 hover:bg-green-100 hover:text-green-900"
            onClick={() => makeValid()}
          >
            Make Valid
          </Button>
        )}

        {isDirty && (
          <Button
            type="submit"
            className="bg-yellow-400 text-black hover:text-white hover:bg-yellow-600"
          >
            Save Changes
          </Button>
        )}
      </div>
    </form>
  );
};
