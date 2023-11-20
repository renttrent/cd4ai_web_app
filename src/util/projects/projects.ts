import { axios } from "@/util/axios";

export const getProjects = async () => {
  return await axios.get("/projects");
};
