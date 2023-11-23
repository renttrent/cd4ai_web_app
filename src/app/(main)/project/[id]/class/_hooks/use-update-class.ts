import { Class } from "@/types/types";
import { updateClass } from "@/util/classes/classes";
import { useMutation } from "@tanstack/react-query";

export const useUpdateClass = () => {
  const q = useMutation({
    mutationFn: async ({
      classData,
      classId,
    }: {
      classId: string;
      classData: Omit<Partial<Class>, "extracted_keywords">;
    }) => {
      return updateClass(classId, classData);
    },
  });

  return q;
};
