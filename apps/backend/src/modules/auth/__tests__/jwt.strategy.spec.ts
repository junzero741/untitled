import { JwtStrategy } from '../strategies/jwt.strategy'
import { JwtPayload } from '../auth.types'

describe('JwtStrategy', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  afterEach(() => {
    delete process.env.JWT_SECRET
  })

  it('should map payload fields to req.user shape', async () => {
    const strategy = new JwtStrategy()
    const payload: JwtPayload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      username: 'testuser',
    }

    const result = await strategy.validate(payload)

    expect(result).toEqual({
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
    })
  })
})
