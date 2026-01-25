import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { User } from '../../entities'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, username: string, password: string): Promise<User> {
    return this.usersService.create(email, username, password)
  }

  async login(email: string, password: string): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await this.usersService.validatePassword(user, password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
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

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
