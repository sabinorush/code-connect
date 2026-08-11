import { HttpResponse, http } from 'msw'

// Default happy-path handlers mirroring apps/api's real responses
// exactly (status codes and field names included — see
// apps/api/src/auth/dto/session-response.dto.ts and
// apps/api/src/users/dto/user-response.dto.ts). Individual tests
// override these with server.use(...) for error cases.
const API_URL = 'http://localhost:3000'

export const validUser = {
  id: '2f9b6f3e-19c8-4e2a-9d3f-6b6a3a2f9c11',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  createdAt: '2026-08-11T12:00:00.000Z',
}

export const validSession = {
  accessToken: 'valid-token',
  tokenType: 'Bearer',
  expiresIn: 3600,
}

export const handlers = [
  http.post(`${API_URL}/sessions`, () => {
    return HttpResponse.json(validSession, { status: 201 })
  }),

  http.post(`${API_URL}/users`, () => {
    return HttpResponse.json(validUser, {
      status: 201,
      headers: { Location: `/users/${validUser.id}` },
    })
  }),

  http.get(`${API_URL}/users/me`, ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth !== `Bearer ${validSession.accessToken}`) {
      return HttpResponse.json(
        { statusCode: 401, message: 'Invalid or expired token', error: 'Unauthorized' },
        { status: 401 },
      )
    }
    return HttpResponse.json(validUser, { status: 200 })
  }),
]
