import { useState } from 'react'
import styled from 'styled-components'

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

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <FormBox>
      <h2>Log in to application</h2>
      <form onSubmit={onSubmit}>
        <FieldRow>
          <label>
            username
            <input
              data-testid="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </FieldRow>
        <SubmitButton type="submit">login</SubmitButton>
      </form>
    </FormBox>
  )
}

export default LoginForm
