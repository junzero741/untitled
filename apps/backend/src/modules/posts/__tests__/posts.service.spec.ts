import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PostsService } from '../posts.service'
import { Post } from '../../../entities'

describe('PostsService', () => {
  let service: PostsService

  const mockAuthor = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'author@example.com',
    username: 'author',
  }

  const mockPost = {
    id: 'post-uuid-1',
    title: 'Test Post',
    content: 'This is test content',
    authorId: mockAuthor.id,
    author: mockAuthor,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<PostsService>(PostsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new post', async () => {
      mockRepository.create.mockReturnValue({
        authorId: mockPost.authorId,
        title: mockPost.title,
        content: mockPost.content,
      })
      mockRepository.save.mockResolvedValue(mockPost)

      const result = await service.create(
        mockAuthor.id,
        mockPost.title,
        mockPost.content,
      )

      expect(mockRepository.create).toHaveBeenCalledWith({
        authorId: mockAuthor.id,
        title: mockPost.title,
        content: mockPost.content,
      })
      expect(mockRepository.save).toHaveBeenCalled()
      expect(result).toEqual(mockPost)
    })
  })

  describe('findById', () => {
    it('should find post by id and increment views', async () => {
      const postWithViews = { ...mockPost, views: 1 }
      mockRepository.findOne.mockResolvedValue(mockPost)
      mockRepository.save.mockResolvedValue(postWithViews)

      const result = await service.findById(mockPost.id)

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPost.id },
        relations: ['author'],
      })
      expect(mockRepository.save).toHaveBeenCalled()
      expect(result).toEqual(postWithViews)
    })

    it('should return null if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null)

      const result = await service.findById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const mockResponse = [[mockPost], 1]
      mockRepository.findAndCount.mockResolvedValue(mockResponse)

      const result = await service.findAll(1, 10)

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['author'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      })
      expect(result.data).toEqual([mockPost])
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
      expect(result.totalPages).toBe(1)
    })
  })

  describe('findByAuthorId', () => {
    it('should return author posts', async () => {
      const mockResponse = [[mockPost], 1]
      mockRepository.findAndCount.mockResolvedValue(mockResponse)

      const result = await service.findByAuthorId(mockAuthor.id, 1, 10)

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { authorId: mockAuthor.id },
        relations: ['author'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      })
      expect(result.data).toEqual([mockPost])
      expect(result.total).toBe(1)
    })
  })

  describe('update', () => {
    it('should update a post if user is author', async () => {
      const updatedPost = {
        ...mockPost,
        title: 'Updated Title',
        content: 'Updated content',
      }

      mockRepository.findOne.mockResolvedValue(mockPost)
      mockRepository.save.mockResolvedValue(updatedPost)

      const result = await service.update(
        mockPost.id,
        mockAuthor.id,
        'Updated Title',
        'Updated content',
      )

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockPost.id } })
      expect(mockRepository.save).toHaveBeenCalled()
      expect(result).toEqual(updatedPost)
    })

    it('should return null if user is not author', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost)

      const result = await service.update(
        mockPost.id,
        'different-user-id',
        'Updated Title',
        'Updated content',
      )

      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should delete a post if user is author', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost)
      mockRepository.remove.mockResolvedValue(mockPost)

      const result = await service.remove(mockPost.id, mockAuthor.id)

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockPost.id } })
      expect(mockRepository.remove).toHaveBeenCalledWith(mockPost)
      expect(result).toBe(true)
    })

    it('should return false if user is not author', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost)

      const result = await service.remove(mockPost.id, 'different-user-id')

      expect(result).toBe(false)
      expect(mockRepository.remove).not.toHaveBeenCalled()
    })
  })
})
