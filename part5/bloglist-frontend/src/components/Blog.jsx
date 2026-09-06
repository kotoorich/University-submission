import styled from 'styled-components'

const BlogContainer = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  background: #fafafa;
`

const LikeButton = styled.button`
  margin-left: 10px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;

  &:hover {
    background: #43a047;
  }
`

const RemoveButton = styled.button`
  margin-top: 10px;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;

  &:hover {
    background: #d32f2f;
  }
`

// exercises 5.25, 5.27: this is now a dedicated single-blog view (reached
// via routing), so details are always shown - only the action buttons are
// gated: "like" requires being logged in, "remove" requires being the
// blog's creator
const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const handleLike = () => onLike(blog)

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onDelete(blog)
    }
  }

  const creatorName = blog.user && blog.user.username
  const isCreator = currentUser && creatorName && currentUser.username === creatorName

  return (
    <BlogContainer className="blog">
      <h2>{blog.title} by {blog.author}</h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}
        {currentUser && <LikeButton onClick={handleLike}>like</LikeButton>}
      </div>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
      {isCreator && <RemoveButton onClick={handleDelete}>remove</RemoveButton>}
    </BlogContainer>
  )
}

export default Blog
