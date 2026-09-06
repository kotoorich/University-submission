import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from '../requests'
import useNotify from '../hooks/useNotify'

const AnecdoteList = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((a) => (a.id === updatedAnecdote.id ? updatedAnecdote : a))
      )
      notify(`you voted '${updatedAnecdote.content}'`)
    }
  })

  // exercise 6.16: show only an error page if the server is unreachable
  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data.toSorted((a, b) => b.votes - a.votes)

  const handleVote = (anecdote) => {
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
