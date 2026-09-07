import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll()
      set({ blogs })
    },
    create: async (blogObject) => {
      const createdBlog = await blogService.create(blogObject)
      set((state) => ({ blogs: state.blogs.concat(createdBlog) }))
      return createdBlog
    },
    like: async (blog) => {
      const updatedBlog = await blogService.update(blog.id, {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      })
      // use the server's populated response instead of merging manually,
      // so the creator's name never goes stale (see part5's exercise 5.9)
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === blog.id ? updatedBlog : b))
      }))
    },
    remove: async (blog) => {
      await blogService.remove(blog.id)
      set((state) => ({ blogs: state.blogs.filter((b) => b.id !== blog.id) }))
    },
    // exercise 7.19
    addComment: async (blogId, comment) => {
      const updatedBlog = await blogService.addComment(blogId, comment)
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === blogId ? updatedBlog : b))
      }))
    },
    findById: (id) => get().blogs.find((b) => b.id === id)
  }
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)

export default useBlogStore
