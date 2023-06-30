import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  findAll() {
    return this.userRepository.findAll();
  }

  findById(id: string) {
    const user = this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with the ID ${id} not found`);
    return user;
  }

  findByEmail(email: string) {
    const user = this.userRepository.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with the email ${email} not found`);
    return user;
  }

  async signup(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.signup(createUserDto);
  }

  async login(userLoginDto: LoginUserDto) {
    const user = await this.findByEmail(userLoginDto.email);
    if (
      !user ||
      !(await bcrypt.compare(userLoginDto.password, user.password))
    ) {
      throw new HttpException(
        'Credentials dont match',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.signJwtToken(user);
    console.log(token);

    return {
      user,
      token,
    };
  }

  updateOne(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateOne(id, updateUserDto);
  }

  deleteOne(id: string) {
    return this.userRepository.deleteOne(id);
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
