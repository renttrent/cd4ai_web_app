import axios from 'axios';
import {Class} from "@/types/types";

export const getClassesByProjectId = async (projectId: string): Promise<Class[]> => {
    return await axios.get("/class/{projectId}");
};

export const createClass = async (classData: any): Promise<Class> => {
    return await axios.post("/class", classData);
};

export const deleteClass = async (classId: string): Promise<void> => {
    return await axios.delete("/class/{classId}");
};

export const markClassAsFavorite = async (classId: string, isFavorite: boolean): Promise<void> => {
    // Not implemented yet
};
