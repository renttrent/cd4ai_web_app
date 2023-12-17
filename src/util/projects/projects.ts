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
  language : "en" | "de";
};
export const createProject = async (data: createProjectParams) => {
  console.log(data);

  const fomrmData = new FormData();
  fomrmData.append("name", data.name);
  fomrmData.append("description", data.description);
  fomrmData.append("language", data.language);
  
  (data.files ?? []).forEach((file) => {
    fomrmData.append("files", file);
  });
  
  try {
    const res = await axios.post("/project", fomrmData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.body;
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
