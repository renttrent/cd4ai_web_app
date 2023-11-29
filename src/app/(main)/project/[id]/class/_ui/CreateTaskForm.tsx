"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingbutton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileDownload } from "@/hooks/use-file-download";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { Class, Project } from "@/types/types";
import { getProject } from "@/util/projects/projects";
import { startTask } from "@/util/task/start-task";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { ObjectSchema, array, object, string } from "yup";
import Papa from "papaparse";
interface TaskCreationState {
  type: "extraction";
  input: {
    files_to_consider: {
      file_path: string;
      column_name?: string;
    }[];
    init_keywords: string;
  };
}

const TaskCreationSchema: ObjectSchema<TaskCreationState> = object({
  type: string().oneOf(["extraction"]).required(),
  input: object({
    files_to_consider: array(
      object({
        file_path: string().required(),
        column_name: string().when("file_path", {
          is: (val: string) => val.endsWith(".csv"),
          then: (s) => s.required(),
        }),
      })
    ).required(),
    init_keywords: string()
      .matches(/^[a-zA-Z ,]+$/)
      .required(),
  }),
});

export const CreateTaskForm = ({
  class: cl,
  onSuccess,
}: {
  class: Class;
  onSuccess?: () => void;
}) => {
  const { register, handleSubmit, setValue, getValues, control } =
    useValidatedForm({
      schema: TaskCreationSchema,
      defaultValues: {
        type: "extraction",
        input: {
          files_to_consider: [],
          init_keywords: "",
        },
      },
    });

  const { fields, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "input.files_to_consider",
  });

  const onFileAddClick = (file: Project["files"][number]) => {
    setValue("input.files_to_consider", [
      ...getValues("input.files_to_consider"),
      file,
    ]);
  };

  const { data: projectData } = useQuery({
    queryKey: ["project", cl.project_id],
    queryFn: async () => await getProject(cl.project_id),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: TaskCreationState) => {
      const {
        input: { init_keywords },
        ...rest
      } = data;
      const keywords = init_keywords
        .split(",")
        .map((keyword) => keyword.trim());
      const classData = {
        ...rest,
        input: {
          ...data.input,
          init_keywords: keywords,
        },
      };

      return startTask(cl.id, classData);
    },
  });

  const onSubmit = async (data: TaskCreationState) => {
    try {
      await mutateAsync(data);
    } catch {
      //ignore
    }
  };

  const availableFiles = projectData?.files.filter((file) => {
    return !getValues("input.files_to_consider").find(
      (f) => f.file_path == file.file_path
    );
  });
  return (
    <div className="">
      <div className="font-bold text-xl">Add a Class</div>
      <form
        onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
        className="flex flex-col gap-3 mt-10"
      >
        <Label hidden htmlFor="type">
          Task Type
        </Label>
        <Input
          hidden
          {...register("type")}
          id="type"
          className="hidden"
          placeholder="Type"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          // disabled={isPending}
        />
        {!!availableFiles?.length && (
          <div className="flex flex-col gap-2">
            <Label>Available Files</Label>
            <div className="flex gap-2">
              {(availableFiles ?? []).map((file, index) => (
                <Button
                  type="button"
                  onClick={() => onFileAddClick(file)}
                  variant="outline"
                  key={index}
                  className="h-10 gap-2 text-lg flex justify-between"
                >
                  <span>{file.file_name}</span>
                  <PlusIcon className=" bg-white text-black rounded-full" />
                </Button>
              ))}
            </div>
          </div>
        )}
        <Label>Selected Files</Label>

        {fields.map((field, index) => {
          return (
            <div
              key={index}
              className="p-4 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-between gap-2 "
            >
              <span className="text-lg font-bold">
                {
                  projectData?.files.find((f) => f.file_path == field.file_path)
                    ?.file_name
                }
              </span>
              {field.file_path.endsWith(".csv") && (
                <ColumnSelection
                  filePath={field.file_path}
                  onSelect={(value) => {
                    setValue(
                      `input.files_to_consider.${index}.column_name`,
                      value
                    );
                  }}
                />
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                className=""
              >
                <X />
              </Button>
            </div>
          );
        })}
        <Label htmlFor="init_keywords">Init Keywords</Label>
        <Input
          {...register("input.init_keywords")}
          id="init_keywords"
          placeholder="Init Keywords "
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          // disabled={isPending}
        />
        <span className="text-xs text-gray-300">seperated by commas</span>
        <LoadingButton disabled={isPending} isLoading={isPending}>
          Submit
        </LoadingButton>
      </form>
    </div>
  );
};

const ColumnSelection = ({
  filePath,
  onSelect,
}: {
  filePath: string;
  onSelect: (value: string) => void;
}) => {
  const { download, data, isPending } = useFileDownload();

  useEffect(() => {
    download(filePath);
  }, []);

  useEffect(() => {
    if (data) {
      parseAsync(data.url).then((result: any) => {
        setHeaders(result?.meta?.fields ?? []);
      });
    }
  }, [data]);

  const [headers, setHeaders] = useState<string[]>([]);
  if (!headers.length) {
    return null;
  }
  return (
    <div className="flex flex-col gap-1">
      <Label>Column Name</Label>
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Column" />
        </SelectTrigger>
        <SelectContent>
          {headers.map((header) => (
            <SelectItem
              key={header}
              value={header}
              onClick={() => onSelect(header)}
            >
              {header}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const parseAsync = function (fileUrl: string) {
  return new Promise(function (complete, error) {
    Papa.parse(fileUrl, { download: true, header: true, complete, error });
  });
};
