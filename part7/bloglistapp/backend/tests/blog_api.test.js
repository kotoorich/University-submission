const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const getTokenForNewUser = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  return { token: loginResponse.body.token, user }
}

describe('when there is initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    const { token: newToken, user } = await getTokenForNewUser()
    token = newToken

    // seed initial blogs, all owned by the same user for simplicity
    for (const blog of helper.initialBlogs) {
      const blogObject = new Blog({ ...blog, user: user._id })
      const saved = await blogObject.save()
      user.blogs = user.blogs.concat(saved._id)
    }
    await user.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // exercise 4.9
  test('the unique identifier property of blogs is named id, not _id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.ok(blog.id !== undefined)
    assert.strictEqual(blog._id, undefined)
  })

  describe('addition of a new blog', () => {
    // exercise 4.10, 4.19
    test('succeeds with valid data and a valid token', async () => {
      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Test Author',
        url: 'http://example.com/async-await',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((b) => b.title)
      assert(titles.includes('async/await simplifies making async calls'))
    })

    // exercise 4.23
    test('fails with status 401 if no token is provided', async () => {
      const newBlog = {
        title: 'this should not get saved',
        author: 'Nobody',
        url: 'http://example.com/nope',
        likes: 1
      }

      const blogsAtStart = await helper.blogsInDb()

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    // exercise 4.11
    test('if likes is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'A blog with no likes specified',
        author: 'Test Author',
        url: 'http://example.com/no-likes'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    // exercise 4.12
    test('fails with status 400 if title is missing', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'http://example.com/no-title',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: 'A blog with no url',
        author: 'Test Author',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    // exercise 4.13, 4.21
    test('succeeds with status 204 if id is valid and token belongs to the creator', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map((b) => b.title)
      assert(!titles.includes(blogToDelete.title))
    })

    // exercise 4.21
    test('fails with status 401 if no token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    // exercise 4.21
    test('fails with status 401 if token belongs to a different user', async () => {
      const passwordHash = await bcrypt.hash('anotherpass', 10)
      const otherUser = new User({ username: 'someoneelse', passwordHash })
      await otherUser.save()

      const otherLogin = await api
        .post('/api/login')
        .send({ username: 'someoneelse', password: 'anotherpass' })

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${otherLogin.body.token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('updating a blog', () => {
    // exercise 4.14
    test('succeeds in updating the number of likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

      const blogsAtEnd = await helper.blogsInDb()
      const updated = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
      assert.strictEqual(updated.likes, blogToUpdate.likes + 1)
    })
  })

  describe('commenting on a blog', () => {
    // exercise 7.18, 7.19: comments are anonymous, no token required
    test('succeeds with a non-empty comment and no token', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToCommentOn = blogsAtStart[0]

      const response = await api
        .post(`/api/blogs/${blogToCommentOn.id}/comments`)
        .send({ comment: 'this is a great read' })
        .expect(201)

      assert(response.body.comments.includes('this is a great read'))

      const blogsAtEnd = await helper.blogsInDb()
      const updated = blogsAtEnd.find((b) => b.id === blogToCommentOn.id)
      assert.strictEqual(updated.comments.length, 1)
    })

    test('fails with status 400 if the comment is empty', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToCommentOn = blogsAtStart[0]

      await api
        .post(`/api/blogs/${blogToCommentOn.id}/comments`)
        .send({ comment: '' })
        .expect(400)
    })

    test('fails with status 404 for a nonexisting blog', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .post(`/api/blogs/${validNonexistingId}/comments`)
        .send({ comment: 'orphaned comment' })
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
