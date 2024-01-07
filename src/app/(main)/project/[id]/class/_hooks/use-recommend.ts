import { getRecommendation } from "@/util/task/get-recommendation";
import { useMutation } from "@tanstack/react-query";

export const useRecommend = () => {
  const q = useMutation({
    mutationKey: ["recommend"],
    mutationFn: async (taskId: string) => {
      return await getRecommendation(taskId);
    },
  });

  return q;
};
