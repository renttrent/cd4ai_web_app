export interface Project {
  project_id: string;
  name: string;
  description: string;
  modification_time: string;
  files: File[];
  files_meta_str: {
    file_name: string;
    column_name: string;
  }[];
}
export interface Class {
  _id: string;
  name: string;
  short_description: string;
  long_description: string;
  project_id: string;
  init_keywords: string[];
  extracted_keywords: string[];
  final_keywords: string[];
  creation_date: string; // Example, should match your API response structure
  is_favorite: boolean; // Whether the class is a favorite for the user
}
