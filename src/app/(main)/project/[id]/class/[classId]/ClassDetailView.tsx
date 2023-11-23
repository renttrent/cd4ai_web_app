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
import { useCallback, useState } from "react";
import { useCancelTask } from "../_hooks/use-cancel_task";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

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
  const nav = useRouter();
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

  const { mutateAsync: deleteAsync } = useMutation({
    mutationFn: async (classId: string) => {
      const res = await deleteClass(classId);
      return res;
    },
    onSuccess: () => {
      nav.replace(`/project/${data?.project_id}`);
    },
  });

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

  console.log(extractionState);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-between flex-wrap">
        <h1 className="text-3xl">{data?.name}</h1>
        <div className="flex gap-2 ">
          <Popover>
            <PopoverTrigger>
              <Button variant="destructive">Delete</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-4 p-2">
                <span className="font-semibold">
                  Are you sure you want to delete this class?
                </span>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => deleteAsync(classId)}
                    variant="destructive"
                  >
                    Delete
                  </Button>

                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
      <div className="flex flex-col gap-1">
        <h2 className="font-bold">Short Description</h2>
        <p>{data?.short_description}</p>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold">Long Description</h2>
        <p>{data?.long_description}</p>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold">Initial Keywords</h2>
        <div className="flex gap-2 text-xl">
          {data?.init_keywords.map((keyword, index) => (
            <Badge key={index} variant="outline">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      <KeywordsSelector
        class={data}
        extracted_keywords={data?.extracted_keywords}
        final_keywords={data?.final_keywords}
      />
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
  const { toast } = useToast();

  const { handleSubmit, watch, setValue } = useValidatedForm({
    schema: KeywordsSchema,
    defaultValues: {
      final_keywords: final_keywords ?? [],
    },
  });
  const { mutateAsync, isPending, isSuccess } = useUpdateClass();

  const final_words = watch("final_keywords");
  const onSubmit = async ({ final_keywords }: { final_keywords: string[] }) => {
    const { _id, ...rest } = cl ?? {};
    cl?._id &&
      (await mutateAsync({
        classId: cl._id,
        classData: {
          ...rest,
          final_keywords: final_keywords,
        },
      }));

    toast({
      title: "Successfully updated",
      description: "The keywords have been updated",
    });
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
                onCheckedChange={(checked) => {
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
