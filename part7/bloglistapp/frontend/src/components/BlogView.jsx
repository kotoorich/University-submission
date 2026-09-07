import { useParams } from 'react-router-dom'
import { useBlogs } from '../store/blogStore'
import { useUser } from '../store/userStore'
import Blog from './Blog'

const BlogView = () => {
  const { id } = useParams()
  const blogs = useBlogs()
  const user = useUser()
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <div>blog not found</div>
  }

  return <Blog blog={blog} currentUser={user} />
}

export default BlogView
