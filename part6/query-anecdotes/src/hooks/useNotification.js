import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'

const useNotification = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export default useNotification
