import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersModule } from '../users/users.module'

// Read and validate JWT configuration at module load time to fail fast on misconfiguration.
const jwtSecret: string | undefined = process.env.JWT_SECRET

if (!jwtSecret) {
  // Failing fast here prevents the application from starting with an insecure default secret.
  throw new Error('JWT_SECRET environment variable is required for JWT configuration.')
}

// Parse JWT expiration from environment, defaulting to 86400 seconds (1 day) on invalid or missing input.
const rawJwtExpiration: string | undefined = process.env.JWT_EXPIRATION
const parsedJwtExpiration: number = rawJwtExpiration
  ? parseInt(rawJwtExpiration, 10)
  : 86400

const jwtExpiration: number = Number.isNaN(parsedJwtExpiration) ? 86400 : parsedJwtExpiration

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: jwtExpiration,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
