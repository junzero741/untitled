import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from '../users.service'
import { User } from '../../entities'
import * as bcrypt from 'bcryptjs'

jest.mock('bcryptjs')

describe('UsersService', () => {
  let service: UsersService
  let repository: Repository<User>

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
    password: '$2a$10$hashedpassword',
    bio: 'Test bio',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should hash password and create a new user', async () => {
      const password = 'password123'
      const hashedPassword = '$2a$10$hashedpassword'

      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
      mockRepository.create.mockReturnValue({
        email: mockUser.email,
        username: mockUser.username,
        password: hashedPassword,
      })
      mockRepository.save.mockResolvedValue(mockUser)

      const result = await service.create(
        mockUser.email,
        mockUser.username,
        password,
      )

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: mockUser.email,
        username: mockUser.username,
        password: hashedPassword,
      })
      expect(mockRepository.save).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser)

      const result = await service.findByEmail(mockUser.email)

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      })
      expect(result).toEqual(mockUser)
    })

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)

      const result = await service.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('findById', () => {
    it('should find user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser)

      const result = await service.findById(mockUser.id)

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      })
      expect(result).toEqual(mockUser)
    })
  })

  describe('validatePassword', () => {
    it('should return true if password matches', async () => {
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.validatePassword(
        mockUser,
        'password123',
      )

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      )
      expect(result).toBe(true)
    })

    it('should return false if password does not match', async () => {
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const result = await service.validatePassword(
        mockUser,
        'wrongpassword',
      )

      expect(result).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('should update user bio', async () => {
      const newBio = 'Updated bio'
      mockRepository.findOne.mockResolvedValue({
        ...mockUser,
        bio: newBio,
      })

      const result = await service.updateProfile(mockUser.id, newBio)

      expect(mockRepository.update).toHaveBeenCalledWith(mockUser.id, {
        bio: newBio,
      })
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      })
    })
  })
})
