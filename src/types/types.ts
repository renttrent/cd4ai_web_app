export interface Project {
  id: string;
  project_id: string;
  name: string;
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
