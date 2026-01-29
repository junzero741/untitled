import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET')

        if (!jwtSecret) {
          throw new Error('JWT_SECRET environment variable is required for JWT configuration.')
        }

        // Parse JWT expiration from environment, defaulting to 86400 seconds (1 day) on invalid or missing input.
        const rawJwtExpiration = configService.get<string>('JWT_EXPIRATION')
        const parsedJwtExpiration = rawJwtExpiration ? parseInt(rawJwtExpiration, 10) : 86400
        const jwtExpiration = Number.isNaN(parsedJwtExpiration) ? 86400 : parsedJwtExpiration

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiration,
          },
        }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
