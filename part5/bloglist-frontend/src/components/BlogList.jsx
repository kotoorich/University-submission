import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const CreateButton = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover {
    background: #1565c0;
  }
`

const BlogRow = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #eee;

  a {
    color: #1976d2;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`

const BlogList = ({ blogs, user }) => {
  const navigate = useNavigate()
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      {user && (
        <p>
          <CreateButton onClick={() => navigate('/blogs/new')}>create new blog</CreateButton>
        </p>
      )}

      {sortedBlogs.map(blog => (
        <BlogRow key={blog.id} className="blogSummary">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </BlogRow>
      ))}
    </div>
  )
}

export default BlogList
