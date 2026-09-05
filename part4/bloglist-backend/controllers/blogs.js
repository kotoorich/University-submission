const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

// exercise 4.17: populate the creator's user info with each blog
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1
  })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// exercise 4.19, 4.22: only a logged-in user (via userExtractor) can create
// a blog; the blog is linked to that user
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1
  })

  response.status(201).json(populatedBlog)
})

// exercise 4.21, 4.22: only the user who created the blog may delete it
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  const user = request.user

  if (blog.user && blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  if (blog.user) {
    user.blogs = user.blogs.filter((id) => id.toString() !== blog._id.toString())
    await user.save()
  }

  response.status(204).end()
})

// exercise 4.14: updating likes (not restricted to the creator - anyone can
// "like" a blog post, matching the exercise's description of the feature)
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title ?? blog.title
  blog.author = author ?? blog.author
  blog.url = url ?? blog.url
  blog.likes = likes ?? blog.likes

  const updatedBlog = await blog.save()
  const populatedBlog = await updatedBlog.populate('user', {
    username: 1,
    name: 1
  })

  response.json(populatedBlog)
})

module.exports = blogsRouter
