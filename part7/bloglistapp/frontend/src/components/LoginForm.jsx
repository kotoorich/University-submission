import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useField } from '../hooks/useField'
import { useUserActions } from '../store/userStore'
import { useNotificationActions } from '../store/notificationStore'

const FormBox = styled.div`
  max-width: 300px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
`

const FieldRow = styled.div`
  margin-bottom: 10px;

  label {
    display: block;
    font-size: 14px;
    color: #555;
  }

  input {
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
  }
`

const SubmitButton = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background: #1565c0;
  }
`

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')
  const { login } = useUserActions()
  const { showNotification } = useNotificationActions()
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await login({ username: username.value, password: password.value })
      username.reset()
      password.reset()
      showNotification(`Welcome back, ${user.name}`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      showNotification('wrong username or password', 'error')
    }
  }

  // exercise 7.15: destructure `reset` out before spreading, same fix as
  // part 7's earlier useField exercises
  const { reset: _resetUsername, ...usernameInput } = username
  const { reset: _resetPassword, ...passwordInput } = password

  return (
    <FormBox>
      <h2>Log in to application</h2>
      <form onSubmit={onSubmit}>
        <FieldRow>
          <label>
            username
            <input data-testid="username" {...usernameInput} />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            password
            <input data-testid="password" {...passwordInput} />
          </label>
        </FieldRow>
        <SubmitButton type="submit">login</SubmitButton>
      </form>
    </FormBox>
  )
}

export default LoginForm
