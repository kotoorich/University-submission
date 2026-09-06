import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import App from '../App'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

beforeEach(() => {
  blogService.getAll.mockResolvedValue([
    {
      id: '1',
      title: 'A public blog',
      author: 'Author One',
      url: 'http://example.com/1',
      likes: 2,
      user: { id: 'u1', username: 'creator', name: 'Creator Name' }
    }
  ])
  window.localStorage.clear()
})

test('root path shows the blog list without requiring login', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  expect(await screen.findByText('A public blog Author One')).toBeDefined()
  // logged-out users see a login link in the nav, not a login form on "/"
  expect(screen.getByText('login')).toBeDefined()
})

test('/login path shows the login form', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  )

  expect(await screen.findByText('Log in to application')).toBeDefined()
})

test('/blogs/:id shows that blog\'s details without requiring login', async () => {
  render(
    <MemoryRouter initialEntries={['/blogs/1']}>
      <App />
    </MemoryRouter>
  )

  expect(await screen.findByText('A public blog by Author One')).toBeDefined()
  expect(screen.getByText('likes 2', { exact: false })).toBeDefined()
  // not logged in - no like/remove buttons
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('/blogs/new redirects unauthenticated users to /login', async () => {
  render(
    <MemoryRouter initialEntries={['/blogs/new']}>
      <App />
    </MemoryRouter>
  )

  expect(await screen.findByText('Log in to application')).toBeDefined()
})

test('clicking a blog title in the list navigates to its detail view', async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  )

  const link = await screen.findByText('A public blog Author One')
  await user.click(link)

  expect(await screen.findByText('A public blog by Author One')).toBeDefined()
})
