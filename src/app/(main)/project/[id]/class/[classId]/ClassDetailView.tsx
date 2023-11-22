"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/hooks/use-validated-form";
import {
  getClassById,
  getClassesByProjectId,
  updateClass,
} from "@/util/classes/classes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BarLoader, PulseLoader } from "react-spinners";
import { array, object, string } from "yup";
import { useUpdateClass } from "../_hooks/use-update-class";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Class } from "@/types/types";

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

  const taskInProgress = false;

  if (isLoading || taskInProgress == undefined) {
    return <BarLoader width="100%" className="mt-4" />;
  }

  const extractionState: ExtractionState = data?.extracted_keywords
    ? ExtractionState.COMPLETED
    : taskInProgress
    ? ExtractionState.IN_PROGRESS
    : ExtractionState.NOT_STARTED;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-between flex-wrap">
        <h1 className="text-3xl">{data?.name}</h1>
        <div className="flex gap-2 ">
          <Button variant="destructive">Delete</Button>
          {extractionState == ExtractionState.NOT_STARTED ? (
            <Button>Start Keyword Extraction</Button>
          ) : extractionState == ExtractionState.IN_PROGRESS ? (
            <Button>Stop Extraction</Button>
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
          {data?.init_keywords.map((keyword) => (
            <Badge variant="outline">{keyword}</Badge>
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
  const { handleSubmit, watch, setValue } = useValidatedForm({
    schema: KeywordsSchema,
    defaultValues: {
      final_keywords: final_keywords ?? [],
    },
  });
  const { mutateAsync, isPending } = useUpdateClass();

  const final_words = watch("final_keywords");
  const onSubmit = async ({ final_keywords }: { final_keywords: string[] }) => {
    const { _id, ...rest } = cl ?? {};
    return (
      cl?._id &&
      (await mutateAsync({
        classId: cl._id,
        classData: {
          ...rest,
          final_keywords: final_keywords,
        },
      }))
    );
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

            <div>
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
