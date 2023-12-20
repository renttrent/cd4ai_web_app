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
export type updateProjectParams = {
  name?: string;
  description?: string;
  files?: File[] | null;
  delete_file_paths?: string;
};

export const updateProject = async (id: string,data: updateProjectParams) => {
  console.log(data);

  const fomrmData = new FormData();
  fomrmData.append("name", data?.name as string);
  fomrmData.append("description", data?.description as string);
  
  (data.files ?? []).forEach((file) => {
    fomrmData.append("files", file);
  });
  if(data.delete_file_paths) 
    fomrmData.append("delete_file_paths", data.delete_file_paths as string);

  try {
    const res = await axios.put(`/project/${id}`, fomrmData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.body;
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}; 
export const editProject = async (id: string, data: updateProjectParams) => {
  try {
    const res = await axios.put(`/project/${id}`, data);
    return res.data.body;
  } catch (error) {
    console.error("Error editing project:", error);
  }
};

export const deleteProject = async (id: string) => {
  try {
    return await axios.delete(`/project/${id}`);
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};
