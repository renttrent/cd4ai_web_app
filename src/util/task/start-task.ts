import { axios } from "../axios";

type StartTaskResponse = {
  task_id: string | null;
};

export type StartTaskRequest = {
  type: "extraction";
  input: {
    files_to_consider: {
      file_path: string;
      column_name?: string;
    }[];
    init_keywords: string[];
  };
};

export const startTask = async (
  classId: string,
  data: StartTaskRequest
): Promise<StartTaskResponse> => {
  const res = await axios.post(`/task/?class_id=${classId}`, data);

  if (res.status === 200) {
    return {
      task_id: res.data.task_id,
    };
  }
  return {
    task_id: null,
  };
};
