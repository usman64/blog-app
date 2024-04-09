import { Link } from "react-router-dom";

interface BlogCardProps {
    id:  string;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
}: BlogCardProps) => {
    return (
        <Link to={`/blogs/${id}`}>
            <div className="border-b border-slate-200 p-4 w-screen max-w-screen-lg">
                <div className="flex items-center">    
                    <span className="flex flex-col justify-center">
                        <Avatar name={authorName} /> 
                    </span>
                    <span className="font-extralight pl-2">
                        {authorName}
                    </span>
                    <span className="pl-2 text-slate-400">
                        &middot;
                    </span>
                    <span className="font-thin pl-2 text-slate-400">
                        {publishedDate}
                    </span> 
                </div>
                <div className="pt-2 text-xl font-semibold">
                    {title}
                </div>
                <div className="text-md font-thin">
                    {content?.substring(0,100) + (content?.length > 100 ? "..." : "")}
                </div>
                <div className="text-slate-400 text-sm font-thin">
                    {`${Math.ceil(content?.length / 100)} minutes(s) read`}
                </div>
            </div>
        </Link>
    )
}

export function Avatar ({name}: {name: string}) {
    return (
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
            <span className="font-medium text-gray-600">{name[0]}</span>
        </div>
    )
}