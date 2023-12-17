import { axios } from "../axios";

export interface BaseTask {
  name?: string;
  id: string;
  class_id: string;
  parent_id?: string | null;
  status: "in progress" | "completed" | "cancelled";
  start_time: string;
  end_time: string;
  valid: boolean;
  lang:"en" | "de";
  execution_mod:"fast" | "precise";
}

export interface KeywordsExtractionTask extends BaseTask {
  type: "keywords extraction";
  result: {
    extracted_keywords_count: number;
    extracted_keywords: string[];
    filtered_keywords: string[];
  } | null;
  input: {
    files_to_consider: {
      file_path: string;
      column_name: string;
    }[];
    init_keywords: string[];
  };
}

export interface ContextWindowsExtractionTask extends BaseTask {
  type: "context windows extraction";
  result: {
    extracted_context_windows: string[];
    filtered_context_windows: string[];
  } | null;
  input: {
    files_to_consider: {
      file_path: string;
      column_name: string;
    }[];
    filtered_keywords: string[];
  };
}

export type Task = KeywordsExtractionTask | ContextWindowsExtractionTask;

export const getTasks = async (classId: string) => {
  const res = await axios.get(`/task?class_id=${classId}`);

  return res.data.body as Task[];
};

export const getTask = async (taskId: string) => {
  const res = await axios.get(`/task/${taskId}`);

  return res.data.body as Task;
};

export const updateTask = async (taskId: string, data: any) => {
  const res = await axios.put(`/task/${taskId}`, data);

  return res.data.body as Task;
};

export const RenameTask = async (taskId: string, name: string) => {
  const res = await axios.put(`/task/rename/${taskId}?task_name=${name}`);

  return res.data.body as Task;
};

export const getChildrenTasks = async (taskId: string) => {
  const res = await axios.get(`/task/children/${taskId}/`);

  return res.data.body as Task[];
};

export type TaskResult = {
  extracted_keywords: string[];
  filtered_keywords: string[];
} | null;
