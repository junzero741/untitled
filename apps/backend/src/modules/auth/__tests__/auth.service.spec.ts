import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { UsersService } from '../../users/users.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
    password: '$2a$10$hashedpassword',
  }

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('signUp', () => {
    it('should create a new user', async () => {
      mockUsersService.create.mockResolvedValue(mockUser)

      const result = await service.signUp(
        mockUser.email,
        mockUser.username,
        'password123',
      )

      expect(mockUsersService.create).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.username,
        'password123',
      )
      expect(result).toEqual(mockUser)
    })
  })

  describe('login', () => {
    it('should return accessToken and user on successful login', async () => {
      const token = 'jwt-token-string'

      mockUsersService.findByEmail.mockResolvedValue(mockUser)
      mockUsersService.validatePassword.mockResolvedValue(true)
      mockJwtService.sign.mockReturnValue(token)

      const result = await service.login(mockUser.email, 'password123')

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockUser.email)
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        mockUser,
        'password123',
      )
      expect(mockJwtService.sign).toHaveBeenCalled()
      expect(result.accessToken).toBe(token)
      expect(result.user).toEqual(mockUser)
    })

    it('should throw error if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null)

      await expect(
        service.login(mockUser.email, 'password123'),
      ).rejects.toThrow('User not found')
    })

    it('should throw error if password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser)
      mockUsersService.validatePassword.mockResolvedValue(false)

      await expect(
        service.login(mockUser.email, 'wrongpassword'),
      ).rejects.toThrow('Invalid password')
    })
  })

  describe('validateToken', () => {
    it('should return payload on valid token', async () => {
      const payload = { sub: mockUser.id, email: mockUser.email }
      mockJwtService.verify.mockReturnValue(payload)

      const result = await service.validateToken('valid-token')

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token')
      expect(result).toEqual(payload)
    })

    it('should throw UnauthorizedException on invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      await expect(service.validateToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })
})
