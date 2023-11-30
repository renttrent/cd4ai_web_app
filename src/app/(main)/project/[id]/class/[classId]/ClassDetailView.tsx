"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { getClassById } from "@/util/classes/classes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BarLoader, PulseLoader } from "react-spinners";
import { array, object, string } from "yup";
import { useUpdateClass } from "../_hooks/use-update-class";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Class } from "@/types/types";
import { checkTaskStatus } from "@/util/task/check-task-status";
import { useCallback, useEffect, useState } from "react";
import { useCancelTask } from "../_hooks/use-cancel_task";
import { FaChevronRight } from "react-icons/fa";
import { formatDate, shortFormatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task, TaskResult, getTasks, updateTask } from "@/util/task/tasks";
import { Modal } from "@/components/custom/Modal";
import { CreateTaskForm } from "../_ui/CreateTaskForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaCheckCircle } from "react-icons/fa";
import { FaCirclePause } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

const addTaskToLocalStorage = (classId: string, taskId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`current_task-${classId}`, taskId);
  }
};

const removeTaskFromLocalStorage = (classId: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`current_task-${classId}`);
  }
};

const getTaskFromLocalStorage = (classId: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(`current_task-${classId}`);
  }
};

enum ExtractionState {
  NOT_STARTED = "not-started",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export const ClassDetailView = ({ classId }: { classId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["class", classId],
    queryFn: async () => {
      const res = await getClassById(classId);
      return res;
    },
  });

  const [associatedTaskId, setTaskId] = useState<string | null | undefined>(
    getTaskFromLocalStorage(classId)
  );
  const { data: taskStatus } = useQuery({
    queryKey: ["task", associatedTaskId],
    enabled: associatedTaskId != null,
    refetchInterval: 2000,
    queryFn: async () => {
      const res = associatedTaskId && (await checkTaskStatus(associatedTaskId));
      res == "SUCCESS" && removeTaskId();
      res == "SUCCESS" && window.location.reload();
      return res;
    },
  });

  const [taskList, setTaskList] = useState<Task[]>([]);

  const { data: taskListData, refetch: taskListRefetch } = useQuery({
    queryKey: ["taskList", taskList],
    queryFn: async () => {
      if (data?.id) {
        const res = await getTasks(data?.id);
        return res;
      }
    },
  });

  useEffect(() => {
    taskListRefetch();
  }, [data]);

  const removeTaskId = () => {
    setTaskId(null);
    removeTaskFromLocalStorage(classId);
  };

  // const onKeywordsExtractionSuccessCallback = useCallback(
  //   (res: { task_id: string | null }) => {
  //     setTaskId(res.task_id);
  //     res.task_id && addTaskToLocalStorage(classId, res.task_id);
  //   },
  //   []
  // );

  const { mutateAsync: stopKeywordsExtraction } = useCancelTask(() =>
    removeTaskId()
  );

  const { mutateAsync: syncTask } = useMutation({
    mutationFn: async (data: any) => {
      const res = await updateTask(data.id, {
        result: data.result,
      });

      return res;
    },
  });

  const taskInProgress = taskStatus == "STARTED";

  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);

  const extractionState: ExtractionState = false
    ? ExtractionState.COMPLETED
    : taskInProgress
    ? ExtractionState.IN_PROGRESS
    : ExtractionState.NOT_STARTED;

  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [selectedTaskData, setSelectedTaskData] = useState<Task | null>(null);
  const [results, setResults] = useState<TaskResult | null>(null);
  const [detectedChanges, setDetectedChanges] = useState(false);

  useEffect(() => {
    if (taskListData && selectedTask != null) {
      setSelectedTaskData(taskListData[selectedTask]);
      setResults(taskListData[selectedTask].result as unknown as TaskResult);
    }
  }, [selectedTask]);

  useEffect(() => {
    if (results) {
      setDetectedChanges(selectedTaskData?.result !== results);
    }
  }, [results]);

  const getFileName = (path: string) => {
    const last = path.split("/").pop();
    const fileName = last?.split("-").pop();
    return fileName;
  };

  if (isLoading || taskInProgress == undefined) {
    return <BarLoader width="100%" className="mt-4" />;
  }

  return (
    <div className="flex flex-row">
      <section className="w-4/5">
        <div className="flex flex-row items-center gap-2 p-2 my-2 w-fit">
          <Link href="/" className="font-bold">
            Dashboard
          </Link>
          <FaChevronRight />
          <Link href={`/project/${data?.project_id}`}>Project</Link>
          <FaChevronRight />
          <Link href={`/project/${data?.project_id}/class/${data?.id}`}>
            {data?.name}
          </Link>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center text-5xl mt-2 mb-4 gap-4">
            <div className="font-light text-stone-500">Class:</div>
            <div className="font-bold text-stone-900">{data?.name}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive">Delete</Button>
            {extractionState == ExtractionState.NOT_STARTED ? (
              <Button onClick={() => setIsCreateTaskFormOpen(true)}>
                Start Keyword Extraction
              </Button>
            ) : extractionState == ExtractionState.IN_PROGRESS ? (
              <Button
                onClick={() =>
                  associatedTaskId &&
                  stopKeywordsExtraction({ taskId: associatedTaskId })
                }
              >
                <PulseLoader size={7} color="white" />
                <span> Cancel Extraction</span>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="italic text-stone-500">
            Last Updated: {formatDate(data?.modification_time ?? "")}
          </div>
          <div className="text-stone-700">Description:</div>
          <div className="text-stone-900 font-medium">{data?.description}</div>
        </div>
        <div className="mt-10">
          <div className="text-2xl">
            Phase 1 <span className="font-bold">Extraction</span>
          </div>
          {selectedTask !== null && taskListData && taskListData.length > 0 ? (
            <div className="w-full border rounded-sm mt-2 p-4">
              <div className="flex flex-row justify-between items-center">
                <div className="font-medium text-lg">
                  Task {selectedTask + 1}
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <div>Status {selectedTaskData?.status}</div>
                  {selectedTaskData?.status === "started" && (
                    <Button variant="destructive">Cancel</Button>
                  )}
                  {selectedTaskData?.valid && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full">
                      Valid
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center justify-between text-sm my-4 italic">
                <div>
                  Started at - {formatDate(selectedTaskData?.start_time ?? "")}
                </div>
                {selectedTaskData?.end_time && (
                  <div>
                    Ended at - {formatDate(selectedTaskData?.end_time ?? "")}
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-between">
                <div>
                  <div className="text-lg">Initial Keywords: </div>
                  <div className="flex flex-row gap-2">
                    {selectedTaskData?.input.init_keywords.map(
                      (keyword, index) => (
                        <Badge key={index}>{keyword}</Badge>
                      )
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg">Considered Files:</div>
                  <div>
                    {selectedTaskData?.input.files_to_consider.map(
                      (file, index) => (
                        <div
                          key={index}
                          className="flex flex-row gap-2 items-center"
                        >
                          <div className="font-bold">
                            {getFileName(file.file_path)}
                          </div>
                          {file.column_name && (
                            <div className="">
                              Selected Column:
                              <span className="font-bold text-violet-500">
                                {" " + file.column_name}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              {results !== null && (
                <div className="flex flex-row justify-between mt-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-lg">Extracted Keywords: </div>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {results.extracted_keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          className="w-fit cursor-pointer hover:bg-violet-500 hover:text-white"
                          variant="secondary"
                          onClick={() => {
                            setResults((prev) => {
                              if (prev) {
                                return {
                                  ...prev,
                                  filtered_keywords: [
                                    ...prev.filtered_keywords,
                                    keyword,
                                  ],
                                  extracted_keywords:
                                    prev.extracted_keywords.filter(
                                      (word) => word != keyword
                                    ),
                                };
                              }
                              return null;
                            });
                          }}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex flex-col gap-2">
                    <div className="text-lg">Filtered Keywords: </div>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {results.filtered_keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          className="w-fit cursor-pointer hover:bg-violet-500 hover:text-white"
                          variant="secondary"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="text-right">
                {detectedChanges && (
                  <Button
                    className="bg-yellow-400 text-black hover:text-white"
                    onClick={async () => {
                      await syncTask({
                        id: selectedTaskData?.id,
                        result: {
                          filtered_keywords: results?.filtered_keywords,
                        },
                      });
                      setDetectedChanges(false);
                      taskListRefetch();
                    }}
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div>No task selected</div>
          )}
        </div>
      </section>
      <section className="w-1/6 border border-slate-400 rounded-md bg-slate-100 ml-10 p-4 drop-shadow-lg fixed right-4 m-4 top-0">
        <div className="font-bold text-center">Tasks</div>
        {taskListData && taskListData.length > 0 && (
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Extraction</AccordionTrigger>
                {taskListData.map((task, index) => (
                  <AccordionContent key={index}>
                    <div
                      onClick={() => setSelectedTask(index)}
                      className={`flex flex-row gap-2 items-center ${
                        index === selectedTask ? "bg-indigo-500" : "bg-white"
                      } w-fit m-auto px-4 py-2 ${
                        index === selectedTask && "text-white"
                      } rounded-md border border-slate-200 cursor-pointer font-medium hover:bg-slate-800 hover:text-white`}
                    >
                      {task.status === "started" ? (
                        <FaCirclePause className="text-yellow-500" />
                      ) : task.status === "completed" ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaCircleXmark className="text-red-500" />
                      )}
                      <div>Task {index + 1}</div>
                    </div>
                  </AccordionContent>
                ))}
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </section>
      <Modal
        open={isCreateTaskFormOpen}
        onClose={() => setIsCreateTaskFormOpen(false)}
      >
        {data && (
          <CreateTaskForm
            onSuccess={() => {
              setIsCreateTaskFormOpen(false);
              taskListRefetch();
            }}
            class={data}
          />
        )}
      </Modal>
    </div>
  );
};

const KeywordsSchema = object({
  final_keywords: array().of(string().required()).required(),
});

type KeywordsSelectorProps = {
  extracted_keywords?: string[];
  final_keywords?: string[];
  class?: Class | null;
};
const KeywordsSelector = ({
  extracted_keywords,
  final_keywords,
  class: cl,
}: KeywordsSelectorProps) => {
  const { handleSubmit, watch, setValue } = useValidatedForm({
    schema: KeywordsSchema,
    defaultValues: {
      final_keywords: final_keywords ?? [],
    },
  });
  const { mutateAsync, isPending, isSuccess } = useUpdateClass();

  const final_words = watch("final_keywords");
  const onSubmit = async ({ final_keywords }: { final_keywords: string[] }) => {
    // const { id, ...rest } = cl ?? {};
    // return (
    //   cl?.id &&
    //   (await mutateAsync({
    //     classId: cl.id,
    //     classData: {
    //       ...rest,
    //       final_keywords: final_keywords,
    //     },
    //   }));
  };

  if (!cl) {
    return null;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2 justify-between flex-wrap">
        <div className="flex-1 basis-[300px] flex flex-col gap-2">
          <span className="text-2xl text-bold">Extracted Words</span>
          {(extracted_keywords ?? []).map((keyword, index) => (
            <div key={index} className="flex gap-2 p-3 bg-gray-50">
              <Checkbox
                onCheckedChange={(checked: any) => {
                  if (checked) {
                    setValue("final_keywords", [...final_words, keyword]);
                  } else {
                    setValue(
                      "final_keywords",
                      final_words.filter((word) => word != keyword)
                    );
                  }
                }}
                checked={final_words.includes(keyword)}
              ></Checkbox>
              <Label>{keyword}</Label>
            </div>
          ))}
        </div>
        <div className=" flex-1 basis-[300px] flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <span className="text-2xl text-bold">Final Words</span>

            <div className="flex gap-2 items-center">
              <LoadingButton isLoading={isPending} disabled={isPending}>
                Update
              </LoadingButton>
              {isSuccess && <span>Successfully Updated</span>}
            </div>
          </div>
          {final_words.map((keyword, index) => (
            <div key={index} className="flex gap-2 p-3 bg-gray-50">
              <Label>{keyword}</Label>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
