import { startKeywordsExtraction } from "@/util/keyword-extraction/start-keywords-extraction";
import { useMutation } from "@tanstack/react-query";

export const useStartKeywordsExtraction = (
  onSuccess: (t: { task_id: string | null }) => void
) => {
  const q = useMutation({
    mutationFn: async ({ classId }: { classId: string }) => {
      return startKeywordsExtraction(classId);
    },
    onSuccess,
  });

  return q;
};
