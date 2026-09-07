import styled from 'styled-components'
import { useNotificationMessage, useNotificationType } from '../store/notificationStore'

const SuccessBox = styled.div`
  color: green;
  background: #eef7ee;
  font-size: 20px;
  border: 2px solid green;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`

const ErrorBox = styled.div`
  color: red;
  background: #fbeaea;
  font-size: 20px;
  border: 2px solid red;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`

const Notification = () => {
  const message = useNotificationMessage()
  const type = useNotificationType()

  if (!message) {
    return null
  }

  const Box = type === 'error' ? ErrorBox : SuccessBox

  return <Box>{message}</Box>
}

export default Notification
