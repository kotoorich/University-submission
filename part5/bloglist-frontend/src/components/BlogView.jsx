import { useParams } from 'react-router-dom'
import Blog from './Blog'

const BlogView = ({ blogs, onLike, onDelete, currentUser }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>blog not found</div>
  }

  return (
    <Blog blog={blog} onLike={onLike} onDelete={onDelete} currentUser={currentUser} />
  )
}

export default BlogView
