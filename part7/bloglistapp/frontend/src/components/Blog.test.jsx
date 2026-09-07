import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'
import * as blogStore from '../store/blogStore'
import * as notificationStore from '../store/notificationStore'

vi.mock('../store/blogStore')
vi.mock('../store/notificationStore')

const testBlog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Kent C. Dodds',
  url: 'https://kentcdodds.com',
  likes: 5,
  comments: [],
  user: { id: 'u1', username: 'tester', name: 'Test User' }
}

const otherUser = { id: 'u2', username: 'someoneelse', name: 'Someone Else' }

const renderBlog = (props) => {
  render(
    <MemoryRouter>
      <Blog blog={testBlog} {...props} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  blogStore.useBlogActions.mockReturnValue({
    like: vi.fn(),
    remove: vi.fn(),
    addComment: vi.fn()
  })
  notificationStore.useNotificationActions.mockReturnValue({
    showNotification: vi.fn()
  })
})

test('unauthenticated: shows info and likes, but no like/remove buttons', () => {
  renderBlog({ currentUser: null })

  expect(
    screen.getByText(/Component testing is done with react-testing-library/)
  ).toBeDefined()
  expect(screen.getByText(/Kent C. Dodds/)).toBeDefined()
  expect(screen.getByText('likes 5', { exact: false })).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated non-creator: shows only the like button', () => {
  renderBlog({ currentUser: otherUser })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('the creator sees both the like and remove buttons', () => {
  renderBlog({ currentUser: { id: 'u1', username: 'tester', name: 'Test User' } })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

test('clicking the like button twice calls the like action twice', async () => {
  const like = vi.fn()
  blogStore.useBlogActions.mockReturnValue({ like, remove: vi.fn(), addComment: vi.fn() })

  const user = userEvent.setup()
  renderBlog({ currentUser: otherUser })

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(like.mock.calls).toHaveLength(2)
})

test('submitting the comment form calls addComment with the typed text', async () => {
  const addComment = vi.fn()
  blogStore.useBlogActions.mockReturnValue({ like: vi.fn(), remove: vi.fn(), addComment })

  const user = userEvent.setup()
  renderBlog({ currentUser: otherUser })

  const input = screen.getByRole('textbox')
  await user.type(input, 'nice post!')
  await user.click(screen.getByText('add comment'))

  expect(addComment).toHaveBeenCalledWith('1', 'nice post!')
})
