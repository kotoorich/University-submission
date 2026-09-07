// exercise 4.3
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

// exercise 4.4
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes
  return blogs.reduce(reducer, 0)
}

// exercise 4.5
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best))

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

// exercise 4.6
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const countsByAuthor = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  const topAuthor = Object.keys(countsByAuthor).reduce((best, author) =>
    countsByAuthor[author] > countsByAuthor[best] ? author : best
  )

  return {
    author: topAuthor,
    blogs: countsByAuthor[topAuthor]
  }
}

// exercise 4.7
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = blogs.reduce((totals, blog) => {
    totals[blog.author] = (totals[blog.author] || 0) + blog.likes
    return totals
  }, {})

  const topAuthor = Object.keys(likesByAuthor).reduce((best, author) =>
    likesByAuthor[author] > likesByAuthor[best] ? author : best
  )

  return {
    author: topAuthor,
    likes: likesByAuthor[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
