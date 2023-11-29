import { Project } from "@/types/types";
import { axios } from "@/util/axios";

export const getProjects = async () => {
  const res = await axios.get("/project");

  return res.data.body as Project[];
};

export const getProject = async (id: string) => {
  const res = await axios.get(`/project/${id}`);

  return res.data.body as Project;
};

export const createProject = async (data: any) => {
  const res = await axios.post("/project", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.body;
};
