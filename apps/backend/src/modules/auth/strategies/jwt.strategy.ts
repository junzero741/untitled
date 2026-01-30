import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Ensure that a JWT secret is configured; fail fast if it is missing to avoid insecure defaults.
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable must be set for JWT authentication.')
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    })
  }

  async validate(payload: JwtPayload) {
    // Passport는 validate 반환 값을 req.user로 주입하므로, 컨트롤러에서 사용하는 필드명과 맞춥니다.
    return { sub: payload.sub, email: payload.email, username: payload.username }
  }
}
