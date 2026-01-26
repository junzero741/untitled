import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { ConflictException, UnauthorizedException } from '@nestjs/common'

describe('AuthController', () => {
  let controller: AuthController

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
  }

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('signUp', () => {
    it('should create a new user and return success message', async () => {
      const signUpDto = {
        email: mockUser.email,
        username: mockUser.username,
        password: 'password123',
      }

      mockAuthService.signUp.mockResolvedValue(mockUser)

      const result = await controller.signUp(signUpDto)

      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        signUpDto.email,
        signUpDto.username,
        signUpDto.password,
      )
      expect(result.message).toBe('User created successfully')
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      })
    })

    it('should throw ConflictException when user already exists', async () => {
      const signUpDto = {
        email: mockUser.email,
        username: mockUser.username,
        password: 'password123',
      }

      mockAuthService.signUp.mockRejectedValue(
        new ConflictException('User with this email already exists'),
      )

      await expect(controller.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('login', () => {
    it('should return accessToken and user on successful login', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'password123',
      }

      const token = 'jwt-token-string'

      mockAuthService.login.mockResolvedValue({
        accessToken: token,
        user: mockUser,
      })

      const result = await controller.login(loginDto)

      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      )
      expect(result.message).toBe('Login successful')
      expect(result.accessToken).toBe(token)
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      })
    })

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = {
        email: mockUser.email,
        password: 'wrongpassword',
      }

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      )

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })
})
