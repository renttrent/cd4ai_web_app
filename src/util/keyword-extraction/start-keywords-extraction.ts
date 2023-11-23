import { axios } from "../axios";

type StartKeywordsExtractionResponse = {
  task_id: string | null;
};

export const startKeywordsExtraction = async (
  classId: string
): Promise<StartKeywordsExtractionResponse> => {
  const res = await axios.post(`/keywords/extract/?class_id=${classId}`);

  if (res.status === 200) {
    return {
      task_id: res.data.task_id,
    };
  }
  return {
    task_id: null,
  };
};
