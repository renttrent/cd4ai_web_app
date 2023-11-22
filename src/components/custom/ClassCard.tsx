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
                    <div className="flex flex-row gap-2 mt-2 flex-wrap">
                        {classItem.initKeywords.length > 4 ? (
                            <>
                                {classItem.initKeywords.slice(0, 4).map((keyword, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center text-xs px-1 py-0.5 rounded-md border border-gray-300 mr-1 mb-1`}
                                        style={{
                                            color: colors.purple[600],
                                        }}
                                    >
                                        {keyword}
                                    </div>
                                ))}
                                <Link href={`/class/${classItem.project_id}`} passHref>
                                    <div className="text-xs text-gray-600 font-semibold underline cursor-pointer">
                                        See More
                                    </div>
                                </Link>
                            </>
                        ) : (
                            classItem.initKeywords.map((keyword, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center text-xs px-1 py-0.5 rounded-md border border-gray-300 mr-1 mb-1`}
                                    style={{
                                        color: colors.purple[600],
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
                    <div className="flex flex-row gap-2 mt-2 flex-wrap">
                        {showMore
                            ? classItem.finalKeywords.map((keyword, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center text-xs px-1 py-0.5 rounded-md border border-gray-300 mr-1 mb-1`}
                                    style={{
                                        color: colors.purple[600],
                                    }}
                                >
                                    {keyword}
                                </div>
                            ))
                            : classItem.finalKeywords.slice(0, 4).map((keyword, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center text-xs px-1 py-0.5 rounded-md border border-gray-300 mr-1 mb-1`}
                                    style={{
                                        color: colors.purple[600],
                                    }}
                                >
                                    {keyword}
                                </div>
                            ))}
                        {classItem.finalKeywords.length > 4 && (
                            <div
                                className="text-xs text-gray-600 font-semibold underline cursor-pointer"
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
