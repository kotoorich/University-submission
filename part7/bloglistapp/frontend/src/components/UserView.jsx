import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    usersService.getAll().then((users) => {
      setUser(users.find((u) => u.id === id) || null)
    })
  }, [id])

  if (user === undefined) {
    return <div>loading...</div>
  }

  if (user === null) {
    return <div>user not found</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
