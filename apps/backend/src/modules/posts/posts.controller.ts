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
  NotFoundException,
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
    // 공백만 포함된 제목/내용을 허용하지 않기 위해 앞뒤 공백을 제거한 값을 기준으로 검증합니다.
    const title = body.title?.trim()
    const content = body.content?.trim()

    if (!title || !content) {
      throw new BadRequestException('Title and content are required')
    }

    const post = await this.postsService.create(
      req.user.sub,
      title,
      content,
    )

    return {
      message: 'Post created successfully',
      post,
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
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10))

    const result = await this.postsService.findAll(pageNum, limitNum)

    return {
      message: 'Posts retrieved successfully',
      ...result,
    }
  }

  /**
   * 특정 게시글 조회
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findById(id)

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    return {
      message: 'Post retrieved successfully',
      post,
    }
  }

  /**
   * 사용자의 게시글 목록 조회
   */
  @Get('posts-by-author/:authorId')
  async findByAuthor(
    @Param('authorId') authorId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
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
  }

  /**
   * 게시글 수정
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string },
  ) {
    // 최소한 하나의 필드는 제공되어야 함
    if (!body.title && !body.content) {
      throw new BadRequestException('At least one field (title or content) must be provided')
    }

    const post = await this.postsService.update(
      id,
      req.user.sub,
      body.title,
      body.content,
    )

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
    await this.postsService.remove(id, req.user.sub)

    return {
      message: 'Post deleted successfully',
    }
  }
}
