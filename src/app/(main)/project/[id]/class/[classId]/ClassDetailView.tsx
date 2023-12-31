"use client";

import { Button } from "@/components/ui/button";
import { getClassById } from "@/util/classes/classes";
import { useQuery } from "@tanstack/react-query";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { formatDate, getFileName } from "@/lib/utils";
import Link from "next/link";
import {
  ContextWindowsExtractionTask,
  KeywordsExtractionTask,
  Task,
  getChildrenTasks,
  getTasks,
} from "@/util/task/tasks";
import { Modal } from "@/components/custom/Modal";
import { CreateTaskForm } from "../_ui/CreateTaskForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { KeywordsExtractionTaskView } from "./KeywordsExtractionTaskView";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CornerDownRight, Loader2 } from "lucide-react";
import { ContextWindowTaskView } from "./ContextWindowTaskView";

export const ClassDetailView = ({ classId }: { classId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["class", classId],
    queryFn: async () => {
      const res = await getClassById(classId);
      return res;
    },
  });

  const { data: taskListData, refetch: taskListRefetch } = useQuery({
    queryKey: ["taskList", data?.id],
    refetchInterval(query) {
      if (query.state.data?.some((task) => task.status === "in progress")) {
        return 5000;
      }
    },
    queryFn: async () => {
      if (data?.id) {
        const res = await getTasks(data?.id);
        return res;
      }
    },
  });

  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const [selectedWindowExtractionTask, setSelectedWindowExtractionTask] =
    useState<ContextWindowsExtractionTask | null>(null);

  if (isLoading) {
    return <BarLoader width="100%" className="mt-4" />;
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-2 my-4 w-fit">
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
      <div className="flex flex-row  flex-wrap">
        <section className="flex-1">
          <div className="flex flex-row flex-wrap justify-between items-center">
            <div className="flex-1 flex flex-row items-center text-2xl mt-2 mb-4 gap-4">
              <div className="font-bold">{data?.name}</div>
            </div>
            <div className="flex gap-2">
              <Button
                className="w-fit"
                onClick={() => setIsCreateTaskFormOpen(true)}
              >
                Create Keyword Extraction Task
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="italic text-stone-500">
              Last Updated: {formatDate(data?.modification_time ?? "")}
            </div>
            <div className="text-gray-500  font-medium">
              {data?.description}
            </div>
          </div>
          <div className="mt-10">
            {selectedTask !== null &&
            taskListData &&
            taskListData.length > 0 ? (
              <KeywordsExtractionTaskView
                key={taskListData[selectedTask].id}
                task={taskListData[selectedTask] as KeywordsExtractionTask}
              />
            ) : !selectedWindowExtractionTask ? (
              <div>No task selected</div>
            ) : (
              ""
            )}

            {selectedWindowExtractionTask && selectedTask == null && (
              <ContextWindowTaskView
                key={selectedWindowExtractionTask.id}
                task={selectedWindowExtractionTask}
              />
            )}
          </div>
        </section>
        <div className="basis-96">
          <section className="w-5/6 m-auto p-4 overflow-y-auto border-l">
            <div className="font-bold text-xl">Tasks</div>
            {taskListData && taskListData.length > 0 && (
              <div>
                {taskListData.map((task, index) => (
                  <TaskAccordion
                    task={task as KeywordsExtractionTask}
                    key={task.id}
                    index={index}
                    selected={index == selectedTask}
                    onClick={() => setSelectedTask(index)}
                    onChildrenClick={(task) => {
                      setSelectedWindowExtractionTask(
                        task as ContextWindowsExtractionTask
                      );
                      setSelectedTask(null);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
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
    </div>
  );
};

const TaskAccordion = ({
  task,
  selected,
  onClick,
  onChildrenClick,
  index,
}: {
  task: KeywordsExtractionTask;
  selected: boolean;
  index: number;
  onClick: () => void;
  onChildrenClick?: (task: Task) => void;
}) => {
  const taskName = task.name ?? "";
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <div className="w-full flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <AccordionTrigger>
                  <TaskButton
                    task={task}
                    selected={selected}
                    onClick={() => onClick()}
                  />
                </AccordionTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Used Files:{" "}
                  {task.input.files_to_consider
                    .map((f) => getFileName(f.file_path))
                    .join(",")}
                </p>
                <p>Created Using: {task.input.init_keywords.join(", ")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <AccordionContent>
          <TaskChildrenList
            taskName={taskName}
            onChildTaskClick={onChildrenClick}
            taskId={task.id}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const TaskChildrenList = ({
  taskId,
  taskName,
  onChildTaskClick,
}: {
  taskId: string;
  taskName: string;
  onChildTaskClick?: (task: Task) => void;
}) => {
  const { data } = useQuery({
    queryKey: ["context_windows_extraction_task", taskId],
    queryFn: async () => {
      const res = await getChildrenTasks(taskId);
      return res;
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {data?.map((task, index) => (
        <div key={index} className="flex items-center gap-2">
          <CornerDownRight className="text-gray-500" />
          <TaskButton
            task={task}
            selected={false}
            onClick={() => onChildTaskClick && onChildTaskClick(task)}
          />
        </div>
      ))}
    </div>
  );
};

const TaskButton = ({
  task,
  selected,
  onClick,
}: {
  task: Task;
  selected: boolean;
  onClick: (task: Task) => void;
}) => {
  return (
    <div
      onClick={() => onClick(task)}
      className={`flex flex-row gap-2 text-sm w-full items-center ${
        selected ? "text-blue-500" : ""
      }  rounded-md   cursor-pointer font-medium`}
    >
      {task.status === "in progress" ? (
        <Loader2 className="text-yellow-500 animate-spin" />
      ) : task.status === "completed" ? (
        <FaCheckCircle className="text-green-500" />
      ) : (
        <FaCircleXmark className="text-red-500" />
      )}
      <div>{task.name}</div>
    </div>
  );
};
