export interface Project {
  id: string;
  project_id: string;
  name: string;
  lang: "en" | "de";
  description: string;
  modification_time: string;
  files: {
    file_path: string;
    file_name: string;
    column_name: string;
  }[];
}
export interface Class {
  id: string;
  name: string;
  description: string;
  project_id: string;
  extracted_keywords: string[];
  final_keywords: string[];
  creation_date: string; // Example, should match your API response structure
  is_favorite: boolean; // Whether the class is a favorite for the user
  modification_time: string;
}

export type User = {
  firstname: string;
  lastname: string;
  account_settings:
    | {
        de_embaddings_model: string;
        en_embaddings_model: string;
      }
    | undefined;
};
