const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return await response.json()
}

export const createAnecdote = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 })
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    // exercise 6.21: the server rejects anecdotes shorter than 5
    // characters - surface its error message when available
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to create anecdote')
  }

  return await response.json()
}

export const updateAnecdote = async (anecdote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote)
  }

  const response = await fetch(`${baseUrl}/${anecdote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }

  return await response.json()
}
