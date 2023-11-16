import React, { useState } from "react";

interface ProjectFormProps {
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [csvFiles, setCsvFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileListArray = Array.from(files);
      setCsvFiles((prevFiles) => [...prevFiles, ...fileListArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [
      ...csvFiles.slice(0, index),
      ...csvFiles.slice(index + 1),
    ];
    setCsvFiles(updatedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      //formData.append('userId', user?.id || '');
      csvFiles.forEach((file, i) => {
        formData.append(`csvFiles[${i}]`, file);
      });

      /* const response = await api.post<ApiResponse>('/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); */
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-500 focus-visible:border-indigo-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Description:</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-500 focus-visible:border-indigo-500"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Upload CSV:</span>
            <input
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-500 focus-visible:border-indigo-500"
            />
          </label>
          {csvFiles.length > 0 && (
            <div className="mt-2">
              <span className="text-gray-700">Selected Files:</span>
              <ul className="list-disc pl-4">
                {csvFiles.map((file, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {file.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Create Project
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
