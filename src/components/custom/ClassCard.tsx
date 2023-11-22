import { useState } from "react";
import Link from "next/link";
import colors from "tailwindcss/colors";
import { Class } from "@/types/types";

interface ClassCardProps {
    classItem: Class;
}

const ClassCard = ({ classItem }: ClassCardProps) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="border rounded-md bg-gray-50 border-purple-300 mb-4 p-4 flex flex-col" style={{ minWidth: "200px" }}>
            <div className="flex-grow">
                <h4 className="font-semibold text-lg text-purple-900">{classItem.name}</h4>
                <p className="text-base text-gray-500 mt-2">{classItem.shortDescription}</p>
                <p className="text-base text-gray-600">{classItem.longDescription}</p>
                <div className="text-base text-gray-600">
                    <span className="font-semibold text-gray-700">Initial Keywords:</span>{" "}
                    <div className="flex flex-row gap-4 mt-2 flex-wrap">
                        {classItem.initKeywords.length > 4 ? (
                            <>
                                {classItem.initKeywords.slice(0, 4).map((keyword, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-row items-center gap-2 text-base w-fit px-2 py-1 rounded-md border-2`}
                                        style={{
                                            borderColor: colors.teal[500],
                                            color: colors.teal[500],
                                        }}
                                    >
                                        {keyword}
                                    </div>
                                ))}
                                <Link href={`/class/${classItem.project_id}`} passHref>
                                    <div className="text-base text-purple-600 font-semibold underline cursor-pointer">
                                        See More
                                    </div>
                                </Link>
                            </>
                        ) : (
                            classItem.initKeywords.map((keyword, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-row items-center gap-2 text-base w-fit px-2 py-1 rounded-md border-2`}
                                    style={{
                                        borderColor: colors.teal[500],
                                        color: colors.teal[500],
                                    }}
                                >
                                    {keyword}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="text-base text-gray-600">
                    <span className="font-semibold text-gray-700">Final Keywords:</span>{" "}
                    <div className="flex flex-row gap-4 mt-2 flex-wrap">
                        {showMore
                            ? classItem.finalKeywords.map((keyword, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-row items-center gap-2 text-base w-fit px-2 py-1 rounded-md border-2`}
                                    style={{
                                        borderColor: colors.lime[500],
                                        color: colors.lime[500],
                                    }}
                                >
                                    {keyword}
                                </div>
                            ))
                            : classItem.finalKeywords.slice(0, 4).map((keyword, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-row items-center gap-2 text-base w-fit px-2 py-1 rounded-md border-2`}
                                    style={{
                                        borderColor: colors.lime[500],
                                        color: colors.lime[500],
                                    }}
                                >
                                    {keyword}
                                </div>
                            ))}
                        {classItem.finalKeywords.length > 4 && (
                            <div
                                className="text-base text-purple-600 font-semibold underline cursor-pointer"
                                onClick={() => setShowMore(!showMore)}
                            >
                                {showMore ? "See Less" : "See More"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;