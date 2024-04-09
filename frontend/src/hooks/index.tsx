import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";
import axios from "axios";

export function useBlogs<T>() {
    const [loading, setLoading] = useState<boolean>(false);
    const [blogs, setBlogs] = useState<T>()

    async function getBlogs() {
        setLoading(true)
        const res = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        const blogs = await res.data.posts
        setBlogs(blogs)
        setLoading(false)
    }

    useEffect(() => {
        getBlogs()
    }, [])

    return {
        loading,
        blogs
    }
}