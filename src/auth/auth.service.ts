import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../users/dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { UsersRepository } from '../users/users.repository';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload: UserPayload = {
      email: user.email,
      id: user.id,
    };

    return {
      email: user.email,
      token: await this.signJwtToken(user),
    };
  }

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

  async validate(userLoginDto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(userLoginDto.email);
    if (
      !user ||
      !(await bcrypt.compare(userLoginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Credentials dont match');
    }

    return {
      ...user,
      password: undefined,
    };
  }

  async signJwtToken(payload: UserPayload) {
    return jwt.sign(
      { email: payload.email, id: payload.id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  }
}
