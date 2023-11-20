export interface Project {
  _id: string;
  name: string;
  description: string;
  modification_time: string;
  files: {
    file_name: string;
    column_name: string;
  }[];
}
export interface Class {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  projectId: string;
  initKeywords: string[];
  creationDate: string; // Example, should match your API response structure
  isFavorite: boolean; // Whether the class is a favorite for the user
}
