import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repostitory';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jswService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  async signin(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, username: user.username };
      const accessToken = await this.jswService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException(
      'ユーザー名はまたパスワードを確認してください。',
    );
  }
}
