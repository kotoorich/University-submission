import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  // exercise 6.12: state is initialized with what the backend returns
  it('initialize loads anecdotes from the service', async () => {
    const mockAnecdotes = [
      { id: '1', content: 'First', votes: 0 },
      { id: '2', content: 'Second', votes: 0 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('create appends a new anecdote', async () => {
    const newAnecdote = { id: '3', content: 'Brand new', votes: 0 }
    anecdoteService.createNew.mockResolvedValue(newAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.create('Brand new')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toContainEqual(newAnecdote)
  })

  // exercise 6.15: voting increases the number of votes
  it('vote increases the anecdote\'s votes', async () => {
    const anecdote = { id: '1', content: 'Test', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue({ ...anecdote, votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote('1')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })

  it('remove deletes an anecdote', async () => {
    const anecdote = { id: '1', content: 'To be removed', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.remove.mockResolvedValue()

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.remove('1')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toHaveLength(0)
  })
})

// exercise 6.13: anecdotes come back from the store sorted by votes, descending
describe('useAnecdotes sorting', () => {
  it('returns anecdotes sorted by votes, most votes first', () => {
    const anecdotes = [
      { id: '1', content: 'Low votes', votes: 1 },
      { id: '2', content: 'High votes', votes: 10 },
      { id: '3', content: 'Medium votes', votes: 5 }
    ]
    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map((a) => a.id)).toEqual(['2', '3', '1'])
  })
})

// exercise 6.14: the filtered list a component receives is correct
describe('useAnecdotes filtering', () => {
  const anecdotes = [
    { id: '1', content: 'Testing is fun', votes: 0 },
    { id: '2', content: 'Coding is fun too', votes: 0 }
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes })
  })

  it('returns all anecdotes with no filter', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(2)
  })

  it('returns only anecdotes matching the filter, case-insensitively', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'TESTING' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[0]])
  })

  it('returns an empty list when nothing matches', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'nonexistent' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(0)
  })
})

describe('useFilter', () => {
  it('reflects the current filter value', () => {
    useAnecdoteStore.setState({ filter: 'hello' })
    const { result } = renderHook(() => useFilter())
    expect(result.current).toBe('hello')
  })
})
