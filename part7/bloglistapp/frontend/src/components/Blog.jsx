import { useState } from 'react'
import styled from 'styled-components'
import { useBlogActions } from '../store/blogStore'
import { useNotificationActions } from '../store/notificationStore'
import { useNavigate } from 'react-router-dom'

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

const CommentForm = styled.form`
  margin-top: 10px;

  input {
    margin-right: 8px;
  }
`

const CommentList = styled.ul`
  margin-top: 6px;
`

// exercises 5.25, 5.27, 7.18, 7.19: dedicated single-blog view reached via
// routing - details are always shown, action buttons are gated (like
// requires being logged in, remove requires being the creator), and
// comments are anonymous (no auth needed) and shown below the blog.
const Blog = ({ blog, currentUser }) => {
  const { like, remove, addComment } = useBlogActions()
  const { showNotification } = useNotificationActions()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')

  const handleLike = () => like(blog)

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await remove(blog)
        showNotification(`removed blog "${blog.title}"`)
        navigate('/')
      } catch (exception) {
        console.error(exception)
        showNotification('failed to remove blog', 'error')
      }
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!comment.trim()) {
      return
    }
    await addComment(blog.id, comment)
    setComment('')
  }

  const creatorName = blog.user && blog.user.username
  const isCreator = currentUser && creatorName && currentUser.username === creatorName

  return (
    <BlogContainer className="blog">
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        likes {blog.likes}
        {currentUser && <LikeButton onClick={handleLike}>like</LikeButton>}
      </div>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
      {isCreator && <RemoveButton onClick={handleDelete}>remove</RemoveButton>}

      <h3>comments</h3>
      <CommentForm onSubmit={handleAddComment}>
        <input value={comment} onChange={(event) => setComment(event.target.value)} />
        <button type="submit">add comment</button>
      </CommentForm>
      <CommentList>
        {(blog.comments || []).map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </CommentList>
    </BlogContainer>
  )
}

export default Blog
