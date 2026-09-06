const { test, expect, beforeEach, describe } = require('@playwright/test')

// exercise 5.28: the app now uses routing - login lives at /login (reached
// via a nav link, not shown by default), and creating a blog is its own
// page at /blogs/new. Sorting-by-likes is explicitly not tested here per
// the exercise's own note.

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title').fill('E2E test blog')
      await page.getByLabel('author').fill('Playwright')
      await page.getByLabel('url').fill('http://example.com/e2e')
      await page.getByRole('button', { name: 'create' }).click()

      // creating redirects back to "/", the all-blogs list
      await expect(page.getByText('E2E test blog Playwright')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByLabel('title').fill('A blog to like and delete')
        await page.getByLabel('author').fill('Playwright')
        await page.getByLabel('url').fill('http://example.com/like-delete')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText('A blog to like and delete Playwright')).toBeVisible()

        // navigate into the single-blog detail view
        await page.getByRole('link', { name: 'A blog to like and delete Playwright' }).click()
        await expect(page.getByRole('heading', {
          name: 'A blog to like and delete by Playwright'
        })).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        await expect(page.getByText('likes 0', { exact: false })).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1', { exact: false })).toBeVisible()
      })

      test('the user who added the blog can delete it', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        // deleting redirects back to "/"
        await expect(page.getByText('blogs')).toBeVisible()
        await expect(page.getByText('A blog to like and delete Playwright')).not.toBeVisible()
      })
    })
  })
})
