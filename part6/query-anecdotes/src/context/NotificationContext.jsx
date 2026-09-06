import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'HIDE':
      // only clear if the currently shown message is still the one this
      // timeout was scheduled for - otherwise an earlier notification's
      // timeout could wipe out a newer one
      return state === action.payload ? null : state
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
