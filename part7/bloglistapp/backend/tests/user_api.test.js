const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('password is never exposed in the response', async () => {
    const response = await api.get('/api/users')
    for (const user of response.body) {
      assert.strictEqual(user.passwordHash, undefined)
    }
  })

  // exercise 4.16
  test('creation fails with status 400 if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(result.body.error.includes('unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  // exercise 4.16
  test('creation fails with status 400 if username is missing', async () => {
    const newUser = { name: 'No Username', password: 'salainen' }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.length > 0)
  })

  // exercise 4.16
  test('creation fails with status 400 if password is missing', async () => {
    const newUser = { username: 'nopassword', name: 'No Password' }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.length > 0)
  })

  // exercise 4.16
  test('creation fails with status 400 if username is shorter than 3 characters', async () => {
    const newUser = { username: 'ab', name: 'Short Name', password: 'salainen' }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.length > 0)
  })

  // exercise 4.16
  test('creation fails with status 400 if password is shorter than 3 characters', async () => {
    const newUser = { username: 'validname', name: 'Valid Name', password: 'ab' }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.length > 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})
