import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useField } from '../hooks/useField'
import { useBlogActions } from '../store/blogStore'
import { useNotificationActions } from '../store/notificationStore'

const FormBox = styled.div`
  max-width: 400px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
`

const FieldRow = styled.div`
  margin-bottom: 10px;

  label {
    display: block;
    font-size: 14px;
    color: #555;
  }

  input {
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
  }
`

const SubmitButton = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background: #1565c0;
  }
`

const BlogForm = () => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const { create } = useBlogActions()
  const { showNotification } = useNotificationActions()
  const navigate = useNavigate()

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const createdBlog = await create({
        title: title.value,
        author: author.value,
        url: url.value
      })
      title.reset()
      author.reset()
      url.reset()
      showNotification(`a new blog "${createdBlog.title}" by ${createdBlog.author} added`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      showNotification('failed to create blog', 'error')
    }
  }

  const { reset: _resetTitle, ...titleInput } = title
  const { reset: _resetAuthor, ...authorInput } = author
  const { reset: _resetUrl, ...urlInput } = url

  return (
    <FormBox>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <FieldRow>
          <label>
            title
            <input data-testid="title" {...titleInput} />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            author
            <input data-testid="author" {...authorInput} />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            url
            <input data-testid="url" {...urlInput} />
          </label>
        </FieldRow>
        <SubmitButton type="submit">create</SubmitButton>
      </form>
    </FormBox>
  )
}

export default BlogForm
