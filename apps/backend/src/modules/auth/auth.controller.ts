import { Controller, Post, Body, HttpCode } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpRequest, LoginRequest } from './auth.types'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpRequest) {
    const user = await this.authService.signUp(
      signUpDto.email,
      signUpDto.username,
      signUpDto.password,
    )

    return {
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginRequest) {
    const result = await this.authService.login(loginDto.email, loginDto.password)

    return {
      message: 'Login successful',
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
      },
    }
  }
}
