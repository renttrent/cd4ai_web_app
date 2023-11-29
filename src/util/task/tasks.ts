import { axios } from "../axios";

export type Task = {
  id: string;
  type: string;
  class_id: string;
  status: "started" | "completed" | "cancelled";
  start_time: string;
  end_time: string;
  input: {
    files_to_consider: {
      file_path: string;
      column_name: string;
    }[];
    init_keywords: string[];
  };
  result: {
    extracted_keywords: string[];
    filtered_keywords: string[];
  } | null;
};

export const getTasks = async (classId: string) => {
  const res = await axios.get(`/task?class_id=${classId}`);

  return res.data.body as Task[];
};