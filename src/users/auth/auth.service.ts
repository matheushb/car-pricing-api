import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { UsersRepository } from '../users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UsersRepository) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException(
        `User with the email ${createUserDto.email} already exists!`,
      );
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.signup(createUserDto);
  }

  async login(userLoginDto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(userLoginDto.email);
    if (
      !user ||
      !(await bcrypt.compare(userLoginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Credentials dont match');
    }
    const token = await this.signJwtToken(user);

    return {
      user,
      token,
    };
  }

  async signJwtToken(user: User) {
    return jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  }
}
