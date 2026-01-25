import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  BadRequestException,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

interface AuthenticatedRequest {
  user: {
    sub: string
    email: string
    username: string
  }
}

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  /**
   * 게시글 생성
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: { title: string; content: string },
  ) {
    try {
      if (!body.title || !body.content) {
        throw new BadRequestException('Title and content are required')
      }

      const post = await this.postsService.create(
        req.user.sub,
        body.title,
        body.content,
      )

      return {
        message: 'Post created successfully',
        post,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(message)
    }
  }

  /**
   * 게시글 목록 조회
   */
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const pageNum = Math.max(1, parseInt(page) || 1)
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10))

      const result = await this.postsService.findAll(pageNum, limitNum)

      return {
        message: 'Posts retrieved successfully',
        ...result,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(message)
    }
  }

  /**
   * 특정 게시글 조회
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const post = await this.postsService.findById(id)

      if (!post) {
        throw new BadRequestException('Post not found')
      }

      return {
        message: 'Post retrieved successfully',
        post,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(message)
    }
  }

  /**
   * 사용자의 게시글 목록 조회
   */
  @Get('author/:authorId')
  async findByAuthor(
    @Param('authorId') authorId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const pageNum = Math.max(1, parseInt(page) || 1)
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10))

      const result = await this.postsService.findByAuthorId(
        authorId,
        pageNum,
        limitNum,
      )

      return {
        message: 'Posts retrieved successfully',
        ...result,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(message)
    }
  }

  /**
   * 게시글 수정
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { title: string; content: string },
  ) {
    if (!body.title || !body.content) {
      throw new BadRequestException('Title and content are required')
    }

    const post = await this.postsService.update(
      id,
      req.user.sub,
      body.title,
      body.content,
    )

    if (!post) {
      throw new ForbiddenException(
        'Not authorized to update this post or post not found',
      )
    }

    return {
      message: 'Post updated successfully',
      post,
    }
  }

  /**
   * 게시글 삭제
   */
  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const success = await this.postsService.remove(id, req.user.sub)

    if (!success) {
      throw new ForbiddenException(
        'Not authorized to delete this post or post not found',
      )
    }

    return {
      message: 'Post deleted successfully',
    }
  }
}
