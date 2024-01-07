import { axios } from "../axios";

type GetRecommendationResponse = {
  results: {
    id?: string | null;
    document?: {
      text?: string;
    };
    index?: string;
    relevance_score: number;
  }[];
};

export const getRecommendation = async (
  taskId: string,
  k: number = 10
): Promise<GetRecommendationResponse> => {
  const res = await axios.get(`/task/recommend/${taskId}?k=${k}`);

  return res.data?.body;
};
