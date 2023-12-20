import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { ContextWindowsExtractionTask, getTask } from "@/util/task/tasks";
import { array, object, string } from "yup";
import { useUpdateTask } from "../_hooks/use-update-task";
import { queryClient } from "@/util/query-client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { TaskInfo } from "./TaskInfo";
import { Popover, PopoverClose } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

type WindowsState = {
  final_windows: string[];
};

const windowsSchema = object({
  final_windows: array().of(string().required()).required(),
});

export const ContextWindowTaskView = ({
  task: selectedTask,
}: {
  task: ContextWindowsExtractionTask;
}) => {
  const { data, refetch } = useQuery({
    queryKey: ["task", selectedTask.id],
    queryFn: async () => {
      const res = await getTask(selectedTask.id);
      return res;
    },
    initialData: selectedTask,
  });

  console.log(data);
  const selectedTaskData = data as ContextWindowsExtractionTask;

  const { handleSubmit, watch, setValue, reset, getValues, formState } =
    useValidatedForm({
      schema: windowsSchema,
      defaultValues: {
        final_windows: selectedTaskData.result?.filtered_context_windows ?? [],
      },
    });

  const [filter, setFilter] = useState("");
  const { isDirty } = formState;

  const invalidateTaskList = () => {
    queryClient.invalidateQueries({
      queryKey: ["taskList", selectedTaskData.class_id],
    });
  };
  const { mutateAsync: updateTask } = useUpdateTask();

  const { toast } = useToast();
  const final_windows = watch("final_windows");

  const unselected_extracted_windows = (
    selectedTaskData?.result?.extracted_context_windows ?? []
  ).filter(
    (window) => !final_windows.includes(window) && window.includes(filter)
  );

  const onSubmit = async (data: WindowsState) => {
    await updateTask({
      taskId: selectedTaskData.id,
      data: { result: { filtered_results: data.final_windows ?? [] } },
    });
    toast({
      title: "Updated",
      description: "Task results have been updated",
    });
    invalidateTaskList();
    reset(getValues());
  };

  const renameWindow = (name: string, index: number) => {
    const new_windows = final_windows.map((window, i) =>
      i == index ? name : window
    );
    setValue("final_windows", new_windows, { shouldDirty: true });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-4 rounded-sm mt-2 p-4"
    >
      <TaskInfo task={selectedTaskData} />
      {selectedTaskData.result?.extracted_context_windows !== null &&
        selectedTaskData.status == "completed" && (
          <div className="flex flex-row justify-between mt-4 gap-4">
            <div className=" flex-1 flex flex-col gap-4 p-2 ">
              <div className="text-lg font-bold">Extracted Windows</div>
              <div className="w-full">
                <Input
                  placeholder="Search Window"
                  className="h-6"
                  onChange={(e) => setFilter(e.currentTarget.value ?? "")}
                />
              </div>
              <div className="flex gap-2 flex-wrap  max-h-80 overflow-y-auto no-scrollbar rounded-md p-2 border hover:shadow-md">
                {unselected_extracted_windows.map((window, index) => (
                  <Badge
                    key={index}
                    className="w-fit cursor-pointer hover:bg-primary hover:text-white bg-gray-400 hover:bg-gray-500"
                    variant="default"
                    onClick={() =>
                      setValue("final_windows", [...final_windows, window], {
                        shouldDirty: true,
                      })
                    }
                  >
                    {window}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex-1 text-right flex flex-col gap-4 p-2">
              <div className="text-left text-lg font-bold">
                Filtered Windows
              </div>
              <div className="invisible">
                <Input
                  placeholder="search keyword"
                  className="h-6"
                  onChange={(e) => setFilter(e.currentTarget.value ?? "")}
                />
              </div>
              {final_windows.length > 0 && (
                <div className="flex gap-2 flex-wrap max-h-80 overflow-y-auto no-scrollbar border rounded-md p-2 hover:shadow-md">
                  {final_windows.map((window, index) => (
                    <Popover key={index}>
                      <PopoverTrigger>
                        <Badge
                          key={index}
                          className=" cursor-pointer hover:bg-blue-500 hover:text-white text-white bg-primary"
                          variant="secondary"
                        >
                          <span>{window}</span>
                        </Badge>
                      </PopoverTrigger>

                      <EditPopoverContent
                        onRemovePress={() => {
                          setValue(
                            "final_windows",
                            final_windows.filter((word) => word !== window),
                            {
                              shouldDirty: true,
                            }
                          );
                        }}
                        onChange={(value) => renameWindow(value, index)}
                        value={window}
                      />
                    </Popover>
                  ))}
                </div>
              )}
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

const EditPopoverContent = ({
  onChange,
  onRemovePress,
  value,
}: {
  onChange: (value: string) => void;
  onRemovePress: () => void;
  value: string;
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  const [_value, setValue] = useState<string>(value);

  const closePopover = () => {
    ref.current?.click();
  };
  return (
    <PopoverContent>
      <div className="flex flex-col gap-4">
        <PopoverClose ref={ref} className="hidden">
          close
        </PopoverClose>
        <Label className="font-bold">Edit window</Label>
        <Input
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              e.preventDefault();

              closePopover();
              setTimeout(() => {
                onChange(_value);
              }, 0);
            }
          }}
          defaultValue={value}
        />
        <div className="flex gap-2 justify-between flex-wrap">
          <Button
            size="sm"
            className="flex gap-2"
            type="button"
            variant="destructive"
            onClick={() => {
              closePopover();
              onRemovePress();
            }}
          >
            <span>Remove</span>

            <X />
          </Button>
          <Button
            size="sm"
            className="flex gap-2"
            type="button"
            variant="default"
            onClick={() => {
              closePopover();
              setTimeout(() => {
                onChange(_value);
              }, 0);
            }}
          >
            <span>Update</span>
          </Button>
        </div>
      </div>
    </PopoverContent>
  );
};
