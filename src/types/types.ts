export interface Project {
  project_id: string;
  name: string;
  description: string;
  modification_time: string;
  files: {   // files should be path , it is different from files_meta_str
    file_name: string;
    column_name: string;
  }[];
  files_meta_str: {
    file_name: string;
    column_name: string;
  }[];
}
export interface Class {
  name: string;
  shortDescription: string;
  longDescription: string;
  project_id: string;
  initKeywords: string[];
  finalKeywords: string[];
}
