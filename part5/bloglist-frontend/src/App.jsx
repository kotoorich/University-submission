import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

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
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null) // { message, type }
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  useEffect(() => {
    // exercise 5.24: the blog list at "/" is public, so blogs are fetched
    // regardless of login state
    blogService.getAll().then(returnedBlogs => setBlogs(returnedBlogs))
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      showNotification(`Welcome back, ${loggedUser.name}`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      showNotification(`a new blog "${createdBlog.title}" by ${createdBlog.author} added`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      showNotification('failed to create blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      })
      // exercise 5.9/5.25: use the (populated) object the server returns
      // instead of merging manually, so the creator's name stays correct
      setBlogs(blogs.map(b => (b.id === blog.id ? updatedBlog : b)))
    } catch (exception) {
      console.error(exception)
      showNotification('failed to update likes', 'error')
    }
  }

  const handleDelete = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      showNotification(`removed blog "${blog.title}"`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      showNotification('failed to remove blog', 'error')
    }
  }

  return (
    <div>
      <Nav>
        <NavLink to="/">blogs</NavLink>
        {user ? (
          <UserInfo>
            {user.name} logged in
            <LogoutButton onClick={handleLogout}>logout</LogoutButton>
          </UserInfo>
        ) : (
          <NavLink to="/login">login</NavLink>
        )}
      </Nav>

      <Container>
        <h2>Blog app</h2>
        <Notification notification={notification} />

        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : <LoginForm handleLogin={handleLogin} />}
          />
          <Route
            path="/blogs/new"
            element={user ? <BlogForm createBlog={handleCreateBlog} /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={blogs}
                onLike={handleLike}
                onDelete={handleDelete}
                currentUser={user}
              />
            }
          />
          <Route path="/" element={<BlogList blogs={blogs} user={user} />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
