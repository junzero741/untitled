import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../../entities/post.entity'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  /**
   * 새로운 게시글 생성
   */
  async create(
    authorId: string,
    title: string,
    content: string,
  ): Promise<Post> {
    const post = this.postsRepository.create({
      authorId,
      title,
      content,
    })
    return this.postsRepository.save(post)
  }

  /**
   * ID로 게시글 조회
   */
  async findById(id: string): Promise<Post | null> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    })

    // 조회수 증가 - 데이터베이스 레벨에서 원자적으로 증가시켜 동시성 문제를 방지
    if (post) {
      await this.postsRepository.increment({ id }, 'views', 1)
    }

    return post
  }

  /**
   * 게시글 목록 조회 (페이지네이션)
   */
  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: Post[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit
    const [data, total] = await this.postsRepository.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    })

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 사용자의 게시글 목록 조회
   */
  async findByAuthorId(
    authorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Post[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit
    const [data, total] = await this.postsRepository.findAndCount({
      where: { authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    })

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 게시글 수정
   */
  async update(
    id: string,
    authorId: string,
    title?: string,
    content?: string,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } })

    // 게시글 존재 여부 확인
    if (!post) {
      throw new NotFoundException('Post not found')
    }

    // 작성자 권한 확인
    if (post.authorId !== authorId) {
      throw new ForbiddenException('Not authorized to update this post')
    }

    // 부분 업데이트 지원
    if (title !== undefined) {
      post.title = title
    }
    if (content !== undefined) {
      post.content = content
    }

    return this.postsRepository.save(post)
  }

  /**
   * 게시글 삭제
   */
  async remove(id: string, authorId: string): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id } })

    // 게시글 존재 여부 확인
    if (!post) {
      throw new NotFoundException('Post not found')
    }

    // 작성자 권한 확인
    if (post.authorId !== authorId) {
      throw new ForbiddenException('Not authorized to delete this post')
    }

    await this.postsRepository.remove(post)
  }
}
