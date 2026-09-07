import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'
import * as blogStore from '../store/blogStore'
import * as notificationStore from '../store/notificationStore'

vi.mock('../store/blogStore')
vi.mock('../store/notificationStore')

test('calls create with the right details when a new blog is submitted', async () => {
  const create = vi
    .fn()
    .mockResolvedValue({ title: 'Testing forms is fun', author: 'A. Tester' })
  blogStore.useBlogActions.mockReturnValue({ create })
  notificationStore.useNotificationActions.mockReturnValue({ showNotification: vi.fn() })

  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <BlogForm />
    </MemoryRouter>
  )

  await user.type(screen.getByTestId('title'), 'Testing forms is fun')
  await user.type(screen.getByTestId('author'), 'A. Tester')
  await user.type(screen.getByTestId('url'), 'http://example.com/testing')
  await user.click(screen.getByText('create'))

  expect(create).toHaveBeenCalledWith({
    title: 'Testing forms is fun',
    author: 'A. Tester',
    url: 'http://example.com/testing'
  })
})
