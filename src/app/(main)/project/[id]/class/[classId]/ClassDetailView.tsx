"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { deleteClass, getClassById } from "@/util/classes/classes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BarLoader, PulseLoader } from "react-spinners";
import { array, object, string } from "yup";
import { useUpdateClass } from "../_hooks/use-update-class";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Class } from "@/types/types";
import { checkTaskStatus } from "@/util/keyword-extraction/check-task-status";
import { useStartKeywordsExtraction } from "../_hooks/use-keyword-extraction";
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
import { Task, getTasks } from "@/util/keyword-extraction/tasks";

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

  const onKeywordsExtractionSuccessCallback = useCallback(
    (res: { task_id: string | null }) => {
      setTaskId(res.task_id);
      res.task_id && addTaskToLocalStorage(classId, res.task_id);
    },
    []
  );

  const { mutateAsync } = useStartKeywordsExtraction(
    onKeywordsExtractionSuccessCallback
  );

  const { mutateAsync: stopKeywordsExtraction } = useCancelTask(() =>
    removeTaskId()
  );

  const taskInProgress = taskStatus == "STARTED";

  if (isLoading || taskInProgress == undefined) {
    return <BarLoader width="100%" className="mt-4" />;
  }

  const extractionState: ExtractionState = false
    ? ExtractionState.COMPLETED
    : taskInProgress
    ? ExtractionState.IN_PROGRESS
    : ExtractionState.NOT_STARTED;

  return (
    <div>
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
            <Button onClick={() => mutateAsync({ classId: classId })}>
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
      {taskListData && taskListData?.length > 0 && (
        <div className="mt-4">
          <div className="font-bold text-center my-4 text-lg">
            Tasks and Snapshots
          </div>
          <Table>
            <TableCaption>Your recent tasks.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Initial Keywords</TableHead>
                <TableHead>Extracted Keywords</TableHead>
                <TableHead className="text-right">Start Time</TableHead>
                <TableHead className="text-right">End Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskListData.map((task, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{task.type}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.input.init_keywords.toString()}</TableCell>
                  <TableCell>
                    {task.result?.extracted_keywords.toString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {shortFormatDate(task.start_time)}
                  </TableCell>
                  <TableCell className="text-right">
                    {shortFormatDate(task.end_time)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
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
