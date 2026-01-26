import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from '../../entities'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, username: string, password: string): Promise<User> {
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
    })

    return this.usersRepository.save(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  }

  async updateProfile(
    id: string,
    bio: string,
  ): Promise<User | null> {
    await this.usersRepository.update(id, { bio })
    return this.findById(id)
  }
}
