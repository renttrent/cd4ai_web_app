import { Class } from "@/types/types";
import { axios } from "../axios";

export const getClassesByProjectId = async (
  projectId: string
): Promise<Class[]> => {
  return await axios.get("/class/{projectId}");
};

export const getClassById = async (classId: string): Promise<Class | null> => {
  const res = await axios.get(`/class/${classId}`);

  if (res.status === 200) {
    return res.data.body;
  }
  return null;
};

type CreateClassParams = Pick<
  Class,
  | "name"
  | "short_description"
  | "long_description"
  | "project_id"
  | "init_keywords"
>;

export const createClass = async (
  classData: CreateClassParams
): Promise<Class> => {
  return await axios.post("/class", classData);
};

export const deleteClass = async (classId: string): Promise<void> => {
  return await axios.delete("/class/{classId}");
};

export const updateClass = async (
  classId: string,
  classData: Omit<Partial<Class>, "extracted_keywords">
): Promise<Class> => {
  return await axios.put(`/class?class_id=${classId}`, classData);
};

export const markClassAsFavorite = async (
  classId: string,
  isFavorite: boolean
): Promise<void> => {
  // Not implemented yet
};
