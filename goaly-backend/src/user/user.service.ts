import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      username,
      email,
      password_hash: password,
    });
    return this.userRepository.save(user);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.findOneByUsername(username);

    if (user && bcrypt.compareSync(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>) {
    const payload: JwtPayload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.createUser(username, email, hashedPassword);
  }
}
