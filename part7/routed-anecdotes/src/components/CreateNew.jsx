import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = async (event) => {
    event.preventDefault()
    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  // exercise 7.3: destructure `reset` out of each field before spreading,
  // so it never ends up as an (invalid) prop on the <input> DOM element.
  // Leading underscores match this project's no-unused-vars ignore pattern.
  const { reset: _resetContent, ...contentInput } = content
  const { reset: _resetAuthor, ...authorInput } = author
  const { reset: _resetInfo, ...infoInput } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput} />
        </div>
        <div>
          author
          <input {...authorInput} />
        </div>
        <div>
          url for more info
          <input {...infoInput} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
