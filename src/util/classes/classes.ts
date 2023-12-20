import { Class } from "@/types/types";
import { axios } from "../axios";

export const getClassesByProjectId = async (
  projectId: string
): Promise<Class[]> => {
  const res = await axios.get(`/class?project_id=${projectId}`);
  if (res.status === 200) {
    return res.data.body ?? [];
  }
  return [];
};

export const getClassById = async (classId: string): Promise<Class | null> => {
  const res = await axios.get(`/class/${classId}`);

  if (res.status === 200) {
    return res.data.body;
  }
  return null;
};

type CreateClassParams = Pick<Class, "name" | "description" | "project_id">;

export const createClass = async (
  classData: CreateClassParams
): Promise<Class> => {
  return await axios.post("/class", classData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const deleteClass = async (classId: string): Promise<void> => {
  return await axios.delete(`/class/${classId}`);
};

export const updateClass = async (
  classId: string,
  classData: Omit<Partial<Class>, "extracted_keywords">
): Promise<Class> => {
  return await axios.put(`/class/${classId}`, classData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const markClassAsFavorite = async (
  classId: string,
  isFavorite: boolean
): Promise<void> => {
  // Not implemented yet
};
