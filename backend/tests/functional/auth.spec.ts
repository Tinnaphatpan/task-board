import { test } from '@japa/runner'

test.group('Auth / signup', () => {
  test('returns 201 with valid data', async ({ client }) => {
    const unique = Date.now()
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'Test User',
      email: `test${unique}@example.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
    })
    response.assertStatus(201)
    response.assertBodyContains({ token: {} })
  })

  test('returns 422 when email is already taken', async ({ client }) => {
    const email = `dupe${Date.now()}@example.com`
    await client.post('/api/v1/auth/signup').json({
      fullName: 'User A',
      email,
      password: 'password123',
      passwordConfirmation: 'password123',
    })
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'User B',
      email,
      password: 'password123',
      passwordConfirmation: 'password123',
    })
    response.assertStatus(422)
  })

  test('returns 422 when password is too short', async ({ client }) => {
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'Test User',
      email: `short${Date.now()}@example.com`,
      password: 'abc',
      passwordConfirmation: 'abc',
    })
    response.assertStatus(422)
  })
})

test.group('Auth / login', () => {
  test('returns token on valid credentials', async ({ client }) => {
    const email = `login${Date.now()}@example.com`
    await client.post('/api/v1/auth/signup').json({
      fullName: 'Login Test',
      email,
      password: 'password123',
      passwordConfirmation: 'password123',
    })
    const response = await client.post('/api/v1/auth/login').json({
      email,
      password: 'password123',
    })
    response.assertStatus(200)
    response.assertBodyContains({ token: {} })
  })

  test('returns 400 on invalid credentials', async ({ client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'nobody@example.com',
      password: 'wrongpassword',
    })
    response.assertStatus(400)
  })
})
