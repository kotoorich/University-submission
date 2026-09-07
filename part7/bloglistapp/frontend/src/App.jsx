import { useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import UsersView from './components/UsersView'
import UserView from './components/UserView'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { useUser, useUserActions } from './store/userStore'
import { useBlogActions } from './store/blogStore'

const Nav = styled.nav`
  background: #333;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`

const LogoutButton = styled.button`
  margin-left: 10px;
  background: #555;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;

  &:hover {
    background: #666;
  }
`

const UserInfo = styled.span`
  color: white;
`

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 0 20px;
`

const App = () => {
  const user = useUser()
  const { logout } = useUserActions()
  const { initialize } = useBlogActions()

  useEffect(() => {
    // exercise 7.13: the blog list at "/" is public, so blogs are fetched
    // regardless of login state
    initialize()
  }, [initialize])

  return (
    <div>
      <Nav>
        <NavLink to="/">blogs</NavLink>
        <NavLink to="/users">users</NavLink>
        {user ? (
          <UserInfo>
            {user.name} logged in
            <LogoutButton onClick={logout}>logout</LogoutButton>
          </UserInfo>
        ) : (
          <NavLink to="/login">login</NavLink>
        )}
      </Nav>

      <Container>
        <h2>Blog app</h2>
        <Notification />

        {/* exercise 7.8: the error boundary wraps everything except the
            nav bar, so a rendering error in a route still leaves
            navigation usable */}
        <ErrorBoundary>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate replace to="/" /> : <LoginForm />}
            />
            <Route
              path="/blogs/new"
              element={user ? <BlogForm /> : <Navigate replace to="/login" />}
            />
            <Route path="/blogs/:id" element={<BlogView />} />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="/" element={<BlogList />} />
            {/* exercise 7.9: splat route catches any unmatched path */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Container>
    </div>
  )
}

export default App
