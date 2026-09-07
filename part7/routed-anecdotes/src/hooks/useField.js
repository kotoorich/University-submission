import { useState } from 'react'

// exercise 7.1: manages a single form input's state, returning an object
// with type, value, and onChange - so it can be spread directly onto an
// <input> as `<input {...username} />`.
// exercise 7.2: also exposes a `reset` function for clearing the field.
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}
