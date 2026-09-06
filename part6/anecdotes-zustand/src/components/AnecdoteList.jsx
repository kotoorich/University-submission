import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const handleVote = async (anecdote) => {
    await vote(anecdote.id)
    showNotification(`you voted '${anecdote.content}'`)
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => remove(anecdote.id)}>remove</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
