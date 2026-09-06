import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    // exercise 6.7: load anecdotes from the backend
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    // exercise 6.3, 6.8: create a new anecdote, persisted to the backend
    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },
    // exercise 6.2, 6.9: vote for an anecdote, persisted to the backend
    vote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id)
      const updated = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1
      })
      set((state) => ({
        anecdotes: state.anecdotes.map((a) => (a.id === id ? updated : a))
      }))
    },
    // exercise 6.11: delete an anecdote that has zero votes
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id)
      }))
    },
    setFilter: (value) => set(() => ({ filter: value }))
  }
}))

// exercise 6.6: filtering, exercise 6.5: sorted descending by votes.
// Filtering logic lives here so consuming components don't need to know
// the filter exists at all.
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  const filtered = filter
    ? anecdotes.filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    : anecdotes

  return filtered.toSorted((a, b) => b.votes - a.votes)
}

export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore
