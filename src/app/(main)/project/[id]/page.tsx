"use client";

import {getProject} from "@/util/projects/projects";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {BarLoader} from "react-spinners";
import {FaChevronRight} from "react-icons/fa";
import {IoMdAddCircle} from "react-icons/io";
import {MdEdit} from "react-icons/md";
import colors from "tailwindcss/colors";
import {useEffect, useState} from "react";
import {Class} from "@/types/types";

const Skeleton = () => {
    // TODO
    return <BarLoader width="100%" className="mt-4"/>;
};
const generateFakeClasses = (): Class[] => {
    return [
        {
            name: "Class 1",
            shortDescription: "Short description for Class 1",
            longDescription: "Long description for Class 1",
            project_id: "project_id_1",
            initKeywords: ["keyword1", "keyword2"],
            finalKeywords: ["result1", "result2"],
        },
        {
            name: "Class 2",
            shortDescription: "Short description for Class 2",
            longDescription: "Long description for Class 2",
            project_id: "project_id_2",
            initKeywords: ["keyword3", "keyword4"],
            finalKeywords: ["result3", "result4"],
        },
    ];
};
const Page = ({
                  params,
              }: {
    params: {
        id: string;
    };
}) => {
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [classes, setClasses] = useState<Class[]>([]); // Store classes here
    useEffect(() => {
        const fakeClasses = generateFakeClasses();
        setClasses(fakeClasses);
    }, []);

    const {data: project, isLoading} = useQuery({
        queryKey: ["project", params.id],
        queryFn: async () => {
            const project = await getProject(params.id);
            return project;
        },
    });

    if (isLoading) {
        return <Skeleton/>;
    }

    const formatDate = (d: string) => {
        const date = new Date(d)
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            })
            .split(" ")
            .join(" ");
        return date;
    };

    const getColor = (index: number) => {
        const availableColors = [
            colors.rose[500],
            colors.teal[500],
            colors.cyan[500],
            colors.lime[500],
        ];

        return availableColors[index % availableColors.length];
    };

    return (
        <div>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-2 p-2 my-2 w-fit">
                    <Link href="/" className="font-bold">
                        Dashboard
                    </Link>
                    <FaChevronRight />
                    <Link href={`/project/${project?.project_id}`}>{project?.name}</Link>
                </div>
                <div className="flex flex-row items-center gap-4 font-bold">
                    <button
                        onClick={() => setShowCreateClass(true)} // Open the create class popup on button click
                        className="flex flex-row items-center gap-2 border-2 border-gray-900 bg-gray-900 text-gray-100 px-4 py-2 rounded-md hover:bg-transparent hover:text-gray-900"
                    >
                        <IoMdAddCircle />
                        <span>Create Class</span>
                    </button>
                    <button
                        className="flex flex-row items-center gap-2 border-2 border-gray-900 bg-gray-900 text-gray-100 px-4 py-2 rounded-md hover:bg-transparent hover:text-gray-900"
                    >
                        <MdEdit />
                        <span>Edit project</span>
                    </button>
                </div>
            </div>
            <div className="text-stone-700">Description:</div>
            <div className="text-stone-900 font-medium">
                {project?.description}
            </div>
            <div className="text-stone-700">Files:</div>
            <div className="flex flex-row gap-4">
                {project?.files_meta_str.map((file, index) => (
                    <div
                        key={index}
                        className={`flex flex-row items-center gap-2 text-xs mt-4 w-fit px-2 py-1 rounded-md border-2`}
                        style={{
                            borderColor: getColor(index),
                            color: getColor(index),
                        }}
                    >
                        {file.file_name}
                    </div>
                ))}
            </div>
            {showCreateClass && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-4 rounded-md">
                        {/* Content for the create class form */}
                        <button onClick={() => setShowCreateClass(false)}>Close</button>
                    </div>
                </div>
            )}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-purple-700">Classes</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                    {classes.map((classItem, index) => (
                        <div
                            key={index}
                            className="border rounded-md p-4 bg-purple-100 border-purple-300"
                            style={{ minWidth: "200px" }}
                        >
                            <h4 className="font-semibold text-lg text-purple-900">{classItem.name}</h4>
                            <p className="text-base text-gray-500 mt-2">{classItem.shortDescription}</p>
                            <p className="text-base text-gray-600">
                                {classItem.longDescription}
                            </p>
                            <div className="text-base text-gray-600">
                                <span className="font-semibold text-gray-700">Initial Keywords:</span>{" "}
                                <div className="flex flex-row gap-4 mt-2">
                                    {classItem.initKeywords.map((keyword, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex flex-row items-center gap-2 text-base w-fit px-2 py-1 rounded-md border-2`}
                                            style={{
                                                borderColor: colors.teal[500], // You can replace this with getColor logic if needed
                                                color: colors.teal[500], // You can replace this with getColor logic if needed
                                            }}
                                        >
                                            {keyword}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-base text-gray-600">
                                <span className="font-semibold text-gray-700">Final Keywords:</span>{" "}
                                <div className="flex flex-row gap-4 mt-2">
                                    {classItem.finalKeywords.map((keyword, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex flex-row items-center gap-2 text-base w-fit px-2 py-1 rounded-md border-2`}
                                            style={{
                                                borderColor: colors.lime[500], // You can replace this with getColor logic if needed
                                                color: colors.lime[500], // You can replace this with getColor logic if needed
                                            }}
                                        >
                                            {keyword}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
