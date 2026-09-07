import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

// exercise 7.6 requires components to call useAnecdotes() directly instead
// of receiving anecdotes/functions as props - meaning AnecdoteList and
// CreateNew each call this hook independently. A plain useState *inside*
// the hook would give each call its own disconnected copy of the data, so
// an anecdote added via CreateNew would never appear in AnecdoteList until
// a full reload. To keep every caller in sync, the actual list lives in
// module scope, and each hook instance subscribes to changes via a small
// listener list - the same idea `useSyncExternalStore` formalizes, done by
// hand since this chapter comes before any state-management library.
let anecdotes = []
let listeners = []

const notifyListeners = () => {
  listeners.forEach((listener) => listener(anecdotes))
}

const setAnecdotes = (newAnecdotes) => {
  anecdotes = newAnecdotes
  notifyListeners()
}

export const useAnecdotes = () => {
  const [, forceRender] = useState(anecdotes)

  useEffect(() => {
    const listener = (newAnecdotes) => forceRender(newAnecdotes)
    listeners.push(listener)

    // exercise 7.4: fetch once, on whichever component mounts first
    if (anecdotes.length === 0) {
      anecdoteService.getAll().then((data) => setAnecdotes(data))
    }

    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  // exercise 7.5
  const addAnecdote = async (anecdote) => {
    const created = await anecdoteService.createNew(anecdote)
    setAnecdotes(anecdotes.concat(created))
  }

  // exercise 7.6
  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes(anecdotes.filter((a) => a.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}
