import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { User } from '../../entities'
import { JwtPayload } from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, username: string, password: string): Promise<User> {
    const existingUser = await this.usersService.findByEmail(email)
    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }
    return this.usersService.create(email, username, password)
  }

  async login(email: string, password: string): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await this.usersService.validatePassword(user, password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    }

    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user,
    }
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token) as JwtPayload
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
