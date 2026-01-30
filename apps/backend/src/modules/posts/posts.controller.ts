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
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Post as PostEntity } from '../../entities/post.entity'

interface AuthenticatedRequest {
  user: {
    sub: string
    email: string
    username: string
  }
}

interface ApiAuthor {
  id: string
  username: string
}

const toIsoString = (value: Date | string): string =>
  value instanceof Date ? value.toISOString() : value

const toApiPost = (post: PostEntity, fallbackAuthor?: ApiAuthor) => {
  const author = post.author
    ? { id: post.author.id, username: post.author.username }
    : fallbackAuthor

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: author ?? { id: post.authorId, username: '알 수 없음' },
    views: post.views,
    createdAt: toIsoString(post.createdAt),
    updatedAt: toIsoString(post.updatedAt),
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

    return toApiPost(post, { id: req.user.sub, username: req.user.username })
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
      posts: result.data.map((post) => toApiPost(post)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
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

    return toApiPost(post)
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
      posts: result.data.map((post) => toApiPost(post)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
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

    return toApiPost(post, { id: req.user.sub, username: req.user.username })
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
