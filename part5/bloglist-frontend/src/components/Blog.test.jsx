import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testBlog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Kent C. Dodds',
  url: 'https://kentcdodds.com',
  likes: 5,
  user: { id: 'u1', username: 'tester', name: 'Test User' }
}

const otherUser = { id: 'u2', username: 'someoneelse', name: 'Someone Else' }

// exercise 5.27, case 1: unauthenticated users see the blog's info and
// likes, but no action buttons
test('unauthenticated: shows info and likes, but no buttons', () => {
  render(<Blog blog={testBlog} onLike={() => {}} onDelete={() => {}} currentUser={null} />)

  expect(screen.getByText(/Component testing is done with react-testing-library/)).toBeDefined()
  expect(screen.getByText(/Kent C. Dodds/)).toBeDefined()
  expect(screen.getByText('likes 5', { exact: false })).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

// exercise 5.27, case 2: a logged-in user who is not the creator sees only
// the like button
test('authenticated non-creator: shows only the like button', () => {
  render(
    <Blog blog={testBlog} onLike={() => {}} onDelete={() => {}} currentUser={otherUser} />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

// exercise 5.27, case 3: the blog's creator sees both like and remove
test('the creator sees both the like and remove buttons', () => {
  render(
    <Blog
      blog={testBlog}
      onLike={() => {}}
      onDelete={() => {}}
      currentUser={{ id: 'u1', username: 'tester', name: 'Test User' }}
    />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

test('clicking the like button twice calls the event handler twice', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(
    <Blog blog={testBlog} onLike={mockHandler} onDelete={() => {}} currentUser={otherUser} />
  )

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
