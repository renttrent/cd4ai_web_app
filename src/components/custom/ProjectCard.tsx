import React from 'react';
import { AiFillFolderOpen } from 'react-icons/ai';

interface ProjectCardProps {
    project: {
        name?: string;
        description?: string;
        files?: File[];
    };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    if (!project || !project.name || !project.description || !project.files) {
        // Handle : project or its properties are undefined
        return null;
    }

    return (
        <div className="p-4 border rounded-sm bg-indigo-50">
            <div className="font-medium text-sm text-indigo-400">Project</div>
            <div className="font-bold text-lg">{project.name}</div>
            <div className="text-lg">Subtitle</div>
            <div className="text-sm text-gray-500">{project.description}</div>
            <div className="mt-4">
                <span className="text-gray-700">Files:</span>
                <ul className="pl-4"> {/* Removed list-disc class */}
                    {project.files.map((file, index) => (
                        <li key={index} className="flex items-center">
                            <AiFillFolderOpen className="mr-2" />
                            <a href="/"> {file.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

};


export default ProjectCard;
