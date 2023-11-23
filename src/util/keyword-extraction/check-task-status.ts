import { axios } from "../axios";

export type TaskStatus =
  | "STARTED"
  | "SUCCESS"
  | "CANCELLED"
  | "FAILURE"
  | "NOT_FOUND";

export const checkTaskStatus = async (taskId: string): Promise<TaskStatus> => {
  const res = await axios.get(`/keywords/task-status/${taskId}`);

  if (res.status === 200) {
    const status = res.data?.status;
    return status == "in progress"
      ? "STARTED"
      : status == "completed"
      ? "SUCCESS"
      : status == "cancelled"
      ? "CANCELLED"
      : status == "failed"
      ? "FAILURE"
      : "NOT_FOUND";
  }
  if (res.status === 404) {
    return "NOT_FOUND";
  }

  return "NOT_FOUND";
};
