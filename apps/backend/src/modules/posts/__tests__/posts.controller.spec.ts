import { Test, TestingModule } from '@nestjs/testing'
import { PostsController } from '../posts.controller'
import { PostsService } from '../posts.service'
import { BadRequestException, ForbiddenException } from '@nestjs/common'

describe('PostsController', () => {
  let controller: PostsController

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

  const mockPostsService = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByAuthorId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile()

    controller = module.get<PostsController>(PostsController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new post', async () => {
      const req = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }
      const body = { title: mockPost.title, content: mockPost.content }

      mockPostsService.create.mockResolvedValue(mockPost)

      const result = await controller.create(req as any, body)

      expect(mockPostsService.create).toHaveBeenCalledWith(
        mockAuthor.id,
        body.title,
        body.content,
      )
      expect(result.message).toBe('Post created successfully')
      expect(result.post).toEqual(mockPost)
    })

    it('should throw BadRequestException when title or content is missing', async () => {
      const req = { user: mockAuthor }
      const body = { title: '', content: '' }

      await expect(
        controller.create(req as any, body),
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const page = '1'
      const limit = '10'
      const mockResponse = {
        data: [mockPost],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      mockPostsService.findAll.mockResolvedValue(mockResponse)

      const result = await controller.findAll(page, limit)

      expect(mockPostsService.findAll).toHaveBeenCalledWith(1, 10)
      expect(result.message).toBe('Posts retrieved successfully')
      expect(result.data).toEqual([mockPost])
    })
  })

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockPostsService.findById.mockResolvedValue(mockPost)

      const result = await controller.findOne(mockPost.id)

      expect(mockPostsService.findById).toHaveBeenCalledWith(mockPost.id)
      expect(result.message).toBe('Post retrieved successfully')
      expect(result.post).toEqual(mockPost)
    })

    it('should throw BadRequestException when post not found', async () => {
      mockPostsService.findById.mockResolvedValue(null)

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('findByAuthor', () => {
    it('should return author posts', async () => {
      const authorId = mockAuthor.id
      const page = '1'
      const limit = '10'
      const mockResponse = {
        data: [mockPost],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      mockPostsService.findByAuthorId.mockResolvedValue(mockResponse)

      const result = await controller.findByAuthor(authorId, page, limit)

      expect(mockPostsService.findByAuthorId).toHaveBeenCalledWith(authorId, 1, 10)
      expect(result.message).toBe('Posts retrieved successfully')
      expect(result.data).toEqual([mockPost])
    })
  })

  describe('update', () => {
    it('should update a post', async () => {
      const req = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }
      const body = { title: 'Updated Title', content: 'Updated content' }
      const updatedPost = { ...mockPost, ...body }

      mockPostsService.update.mockResolvedValue(updatedPost)

      const result = await controller.update(req as any, mockPost.id, body)

      expect(mockPostsService.update).toHaveBeenCalledWith(
        mockPost.id,
        mockAuthor.id,
        body.title,
        body.content,
      )
      expect(result.message).toBe('Post updated successfully')
      expect(result.post).toEqual(updatedPost)
    })

    it('should throw ForbiddenException when not authorized', async () => {
      const req = { user: { sub: 'different-user-id', email: mockAuthor.email, username: mockAuthor.username } }
      const body = { title: 'Updated Title', content: 'Updated content' }

      mockPostsService.update.mockResolvedValue(null)

      await expect(
        controller.update(req as any, mockPost.id, body),
      ).rejects.toThrow(ForbiddenException)
    })
  })

  describe('remove', () => {
    it('should delete a post', async () => {
      const req = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }

      mockPostsService.remove.mockResolvedValue(true)

      const result = await controller.remove(req as any, mockPost.id)

      expect(mockPostsService.remove).toHaveBeenCalledWith(
        mockPost.id,
        mockAuthor.id,
      )
      expect(result.message).toBe('Post deleted successfully')
    })

    it('should throw ForbiddenException when not authorized', async () => {
      const req = { user: { sub: 'different-user-id', email: mockAuthor.email, username: mockAuthor.username } }

      mockPostsService.remove.mockResolvedValue(false)

      await expect(
        controller.remove(req as any, mockPost.id),
      ).rejects.toThrow(ForbiddenException)
    })
  })
})
