import { BlogCard } from "../components/BlogCard"
import { AppBar } from "../components/AppBar"
import { useBlogs } from "../hooks"

interface Blog {
    id: string;
    content: string;
    title: string;
    author: {
        name: string;
    }
}

export const Blogs = () => {
    const {loading, blogs} = useBlogs<Blog[]>()

    if (loading) {
        return <div> loading... </div>
    }

    return (
        <div>
            <AppBar />
            <div className="flex justify-center mt-8">
                <div>
                    {
                        blogs?.map((blog, i) => <BlogCard
                                                key={i}
                                                id={blog.id}
                                                authorName={blog.author.name}
                                                title={blog.title} 
                                                content={blog.content}
                                                publishedDate={'2022-10-13'}
                                                />
                        )
                    }
                </div>
            </div>
        </div>
    )
} 