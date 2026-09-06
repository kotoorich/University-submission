import { useState } from 'react'
import styled from 'styled-components'

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

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <FormBox>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <FieldRow>
          <label>
            title
            <input
              data-testid="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            author
            <input
              data-testid="author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            url
            <input
              data-testid="url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </FieldRow>
        <SubmitButton type="submit">create</SubmitButton>
      </form>
    </FormBox>
  )
}

export default BlogForm
