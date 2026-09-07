import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import usersService from '../services/users'

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    text-align: left;
    padding: 6px 10px;
  }

  tr:nth-child(even) {
    background: #f5f5f5;
  }
`

const UsersView = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then((data) => setUsers(data))
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default UsersView
