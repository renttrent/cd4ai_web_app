import { axios } from "../axios";

export const cancelTask = async (taskId: string): Promise<boolean> => {
  const res = await axios.post(`/task/cancel/${taskId}`);

  return res.status === 200;
};
