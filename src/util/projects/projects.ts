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

type createProjectParams = {
  name: string;
  description: string;
  files: File[] | null;
};
export const createProject = async (data: createProjectParams) => {
  const fomrmData = new FormData();
  fomrmData.append("name", data.name);
  fomrmData.append("description", data.description);
  (data.files ?? []).forEach((file) => {
    fomrmData.append("files", file);
  });

  const res = await axios.post("/project", fomrmData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.body;
};
