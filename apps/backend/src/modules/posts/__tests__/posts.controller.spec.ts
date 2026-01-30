import { Test, TestingModule } from '@nestjs/testing'
import { PostsController } from '../posts.controller'
import { PostsService } from '../posts.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

interface MockAuthenticatedRequest {
  user: {
    sub: string
    email: string
    username: string
  }
}

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

  const toApiPost = (post: typeof mockPost) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: {
      id: post.author.id,
      username: post.author.username,
    },
    views: post.views,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  })

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
      const req: MockAuthenticatedRequest = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }
      const body = { title: mockPost.title, content: mockPost.content }

      mockPostsService.create.mockResolvedValue(mockPost)

      const result = await controller.create(req, body)

      expect(mockPostsService.create).toHaveBeenCalledWith(
        mockAuthor.id,
        body.title,
        body.content,
      )
      expect(result).toEqual(toApiPost(mockPost))
    })

    it('should throw BadRequestException when title or content is missing', async () => {
      const req: MockAuthenticatedRequest = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }
      const body = { title: '', content: '' }

      await expect(
        controller.create(req, body),
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
      expect(result.posts).toEqual([toApiPost(mockPost)])
    })
  })

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockPostsService.findById.mockResolvedValue(mockPost)

      const result = await controller.findOne(mockPost.id)

      expect(mockPostsService.findById).toHaveBeenCalledWith(mockPost.id)
      expect(result).toEqual(toApiPost(mockPost))
    })

    it('should throw NotFoundException when post not found', async () => {
      mockPostsService.findById.mockResolvedValue(null)

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
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
      expect(result.posts).toEqual([toApiPost(mockPost)])
    })
  })

  describe('update', () => {
    it('should update a post', async () => {
      const req: MockAuthenticatedRequest = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }
      const body = { title: 'Updated Title', content: 'Updated content' }
      const updatedPost = { ...mockPost, ...body }

      mockPostsService.update.mockResolvedValue(updatedPost)

      const result = await controller.update(req, mockPost.id, body)

      expect(mockPostsService.update).toHaveBeenCalledWith(
        mockPost.id,
        mockAuthor.id,
        body.title,
        body.content,
      )
      expect(result).toEqual(toApiPost(updatedPost))
    })

    it('should support partial updates with only title', async () => {
      const req: MockAuthenticatedRequest = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }
      const body = { title: 'Updated Title' }
      const updatedPost = { ...mockPost, title: 'Updated Title' }

      mockPostsService.update.mockResolvedValue(updatedPost)

      const result = await controller.update(req, mockPost.id, body)

      expect(mockPostsService.update).toHaveBeenCalledWith(
        mockPost.id,
        mockAuthor.id,
        body.title,
        undefined,
      )
      expect(result).toEqual(toApiPost(updatedPost))
    })

    it('should throw BadRequestException when no fields provided', async () => {
      const req: MockAuthenticatedRequest = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }
      const body = {}

      await expect(
        controller.update(req, mockPost.id, body),
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('remove', () => {
    it('should delete a post', async () => {
      const req: MockAuthenticatedRequest = { user: { sub: mockAuthor.id, email: mockAuthor.email, username: mockAuthor.username } }

      mockPostsService.remove.mockResolvedValue(undefined)

      const result = await controller.remove(req, mockPost.id)

      expect(mockPostsService.remove).toHaveBeenCalledWith(
        mockPost.id,
        mockAuthor.id,
      )
      expect(result.message).toBe('Post deleted successfully')
    })
  })
})
