import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const AppBar = () => {
    return <div className="border-b flex justify-between items-center px-10 py-4">
        <Link to='/blogs'>    
            <div>
                Medium
            </div>
        </Link>
        <div>
            <Avatar name={'Usman'} />
        </div>
    </div>
}