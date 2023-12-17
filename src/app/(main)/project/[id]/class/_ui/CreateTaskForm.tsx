"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import 'react-tooltip/dist/react-tooltip.css';
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Tooltip } from 'react-tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileDownload } from "@/hooks/use-file-download";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { parseCsvAsync } from "@/lib/utils";
import { Class, Project } from "@/types/types";
import { getProject } from "@/util/projects/projects";
import { TaskType, startTask } from "@/util/task/start-task";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useState,KeyboardEvent } from "react";
import { useFieldArray } from "react-hook-form";
import { ObjectSchema, array, object, string } from "yup";
interface TaskCreationState {
  type: "keywords extraction";
  input: {
    files_to_consider: {
      file_path: string;
      column_name?: string;
    }[];
    init_keywords: string;
  };
}

const TaskCreationSchema: ObjectSchema<TaskCreationState> = object({
  type: string().oneOf(["keywords extraction"]).required(),
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
    init_keywords: string().required(),
  }),
});

export const CreateTaskForm = ({
  class: cl,
  onSuccess,
}: {
  class: Class;
  onSuccess?: () => void;
}) => {

  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [executionMode, setExecutionMode] = useState('fast');

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecutionMode(event.target.value);
  };

  const { register, handleSubmit, setValue, getValues, control } =
    useValidatedForm({
      schema: TaskCreationSchema,
      defaultValues: {
        type: "keywords extraction",
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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue) {
      event.preventDefault();
      const newKeyword = inputValue.trim();
      if (newKeyword && !keywords.includes(newKeyword)) {
        const newKeywords = [...keywords, newKeyword];
        setKeywords(newKeywords);
        setValue('input.init_keywords', newKeywords.join(', '), { shouldValidate: true });
      }
      setInputValue('');
    }
  };
  
  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, idx) => idx !== index);
    setKeywords(newKeywords);
    setValue('input.init_keywords', newKeywords.join(', '), { shouldValidate: true });
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

      return startTask(cl.id, executionMode, classData);
    },
  });

  const onSubmit = async (data: TaskCreationState) => {
    try {
      await mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const availableFiles = projectData?.files.filter((file) => {
    return !getValues("input.files_to_consider").find(
      (f) => f.file_path == file.file_path
    );
  });

  return (
    <div className="">
      <div className="font-bold text-xl">Start Keyword Extraction</div>
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
        />
        {!!availableFiles?.length && (
          <div className="flex flex-col gap-2">
            <Label>Select Files</Label>
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
        <>
          <div className="flex items-center">
            <Label className="mr-4">
              Execution Mode
            </Label>
            <div className="flex items-center">
              <label 
                data-tooltip-id="my-tooltip" 
                data-tooltip-content="Fast mode processes quickly with less precision" 
                htmlFor="exec-fast" 
                className="flex items-center mr-2">
                <input
                  type="radio"
                  id="exec-fast"
                  name="executionMode"
                  value="fast"
                  checked={executionMode === 'fast'}
                  onChange={handleModeChange}
                  className="mr-1"
                  data-tip data-for="fastTip"
                />
                Fast
              </label>
              <Tooltip id="my-tooltip" />
              <label 
                data-tooltip-id="my-tooltip" 
                data-tooltip-content="Precise mode processes with high accuracy but may be slower"
                htmlFor="exec-precise" className="flex items-center">
                <input
                  type="radio"
                  id="exec-precise"
                  name="executionMode"
                  value="precise"
                  checked={executionMode === 'precise'}
                  onChange={handleModeChange}
                  className="mr-1"
                  data-tip data-for="preciseTip"
                />
                Precise
              </label>
            </div>
          </div>
        </>
        
        
        <Label>Initial Keywords</Label>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a keyword and press Enter"
            style={{
              padding: '8px', 
              margin: '2px', 
              border: '1px solid', 
              borderRadius: '4px',
              width: '100%'
            }}
          />
          <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {keywords.map((keyword, index) => (
              <span key={index} className="tag" style={{ paddingLeft: "5px",padding: '5px', margin: '4px', background: '#E2E8F0', borderRadius: '50px', display: 'inline-flex', alignItems: 'center' }}>
                {keyword}
                <button type="button" onClick={() => removeKeyword(index)} style={{ marginLeft: '10px', background: 'transparent', border: 'none' }}>×</button>
              </span>
            ))}
          </div>
        </div>
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
      parseCsvAsync(data.url).then((result: any) => {
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
