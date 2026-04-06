import { test } from '@japa/runner'

async function createUserAndLogin(client: any) {
  const email = `board${Date.now()}@example.com`
  const signupRes = await client.post('/api/v1/auth/signup').json({
    fullName: 'Board Tester',
    email,
    password: 'password123',
    passwordConfirmation: 'password123',
  })
  const body = signupRes.body()
  return body.token?.value ?? body.data?.token?.value
}

test.group('Boards', () => {
  test('GET /boards returns empty list for new user', async ({ client }) => {
    const token = await createUserAndLogin(client)
    const response = await client
      .get('/api/v1/boards')
      .header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    response.assertBodyContains([])
  })

  test('POST /boards creates a board', async ({ client }) => {
    const token = await createUserAndLogin(client)
    const response = await client
      .post('/api/v1/boards')
      .header('Authorization', `Bearer ${token}`)
      .json({ name: 'My Test Board', description: 'A test board' })
    response.assertStatus(201)
    response.assertBodyContains({ name: 'My Test Board' })
  })

  test('GET /boards returns 401 without token', async ({ client }) => {
    const response = await client.get('/api/v1/boards')
    response.assertStatus(401)
  })
})
