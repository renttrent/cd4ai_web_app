import { axios } from "../axios";

type StartTaskResponse = {
  task_id: string | null;
};

export type TaskType = "keywords extraction" | "context windows extraction";

export type StartTaskRequest =
  | {
      type: "keywords extraction";
      input: {
        files_to_consider: {
          file_path: string;
          column_name?: string;
        }[];
        init_keywords: string[];
      };
    }
  | {
      type: "context windows extraction";
      parent_id: string;
    };

export const startTask = async (
  classId: string,
  execution_mod: string,
  data: StartTaskRequest
): Promise<StartTaskResponse> => {
  const res = await axios.post(`/task/?class_id=${classId}&execution_mod=${execution_mod}`, data);

  if (res.status === 200) {
    return {
      task_id: res.data.task_id,
    };
  }
  return {
    task_id: null,
  };
};
