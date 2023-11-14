/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProjectCard } from './ProjectCard';

export const LatestProjectsView = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch the project list with pagination when the component mounts
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/project', {
                    params: {
                        page: 1,
                        size: 10,
                    },
                });
                setProjects(response.data.projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="mt-10">
            <div className="text-xl">Your latest projects</div>
            <div className="border" />
            <div className="grid grid-cols-3 gap-10 mt-10">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};  */

import React, { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';

export const LatestProjectsView = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Simulating API call with mock data
        const mockProjects = [
            {
                id: 1,
                name: 'Project 1',
                description: 'Description for Project 1',
                files: [{ name: 'File 1' }, { name: 'File 2' }],
            },
            {
                id: 2,
                name: 'Project 2',
                description: 'Description for Project 2',
                files: [{ name: 'File 3' }, { name: 'File 4' }],
            },
            // Add more mock projects as needed
        ];

        setProjects(mockProjects);
    }, []);

    return (
        <div className="mt-10">
            <div className="text-xl">Your latest projects</div>
            <div className="border" />
            <div className="grid grid-cols-3 gap-10 mt-10">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default LatestProjectsView;

