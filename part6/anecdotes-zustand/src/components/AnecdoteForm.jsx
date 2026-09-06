import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()

    await create(content)
    showNotification(`you created '${content}'`)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
