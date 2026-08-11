import { describe, expect, it } from 'vitest'
import { HttpResponse, http } from 'msw'
import { server } from '../test/msw/server'
import { validSession, validUser } from '../test/msw/handlers'
import { createSession, createUser, fetchCurrentUser } from './auth'
import { saveToken } from './tokenStorage'

const API_URL = 'http://localhost:3000'

describe('auth service', () => {
  it('createSession posts credentials and returns the session', async () => {
    const session = await createSession({ email: 'ada@example.com', password: 'super-secret-1' })

    expect(session).toEqual(validSession)
  })

  it('createSession rejects with the axios error on invalid credentials', async () => {
    server.use(
      http.post(`${API_URL}/sessions`, () =>
        HttpResponse.json(
          { statusCode: 401, message: 'Invalid email or password', error: 'Unauthorized' },
          { status: 401 },
        ),
      ),
    )

    await expect(createSession({ email: 'ada@example.com', password: 'wrong' })).rejects.toMatchObject({
      response: { status: 401 },
    })
  })

  it('createUser posts name, email and password and returns the created user', async () => {
    const user = await createUser({ name: 'Ada Lovelace', email: 'ada@example.com', password: 'super-secret-1' })

    expect(user).toEqual(validUser)
  })

  it('createUser rejects on a duplicate email (409)', async () => {
    server.use(
      http.post(`${API_URL}/users`, () =>
        HttpResponse.json(
          { statusCode: 409, message: 'Email already registered', error: 'Conflict' },
          { status: 409 },
        ),
      ),
    )

    await expect(
      createUser({ name: 'Ada Lovelace', email: 'ada@example.com', password: 'super-secret-1' }),
    ).rejects.toMatchObject({ response: { status: 409 } })
  })

  it('fetchCurrentUser attaches the stored bearer token and returns the user', async () => {
    saveToken(validSession.accessToken, true)

    const user = await fetchCurrentUser()

    expect(user).toEqual(validUser)
  })

  it('fetchCurrentUser rejects with 401 when no token is stored', async () => {
    await expect(fetchCurrentUser()).rejects.toMatchObject({ response: { status: 401 } })
  })
})
