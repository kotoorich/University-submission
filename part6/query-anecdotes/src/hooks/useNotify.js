import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'

const useNotify = () => {
  const [, dispatch] = useContext(NotificationContext)

  return (message, seconds = 5) => {
    dispatch({ type: 'SHOW', payload: message })
    setTimeout(() => {
      dispatch({ type: 'HIDE', payload: message })
    }, seconds * 1000)
  }
}

export default useNotify
