import {axios} from "@/api/axios";

export const getProjects = async () => {
    return await axios.get("/projects");
};
