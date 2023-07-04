import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany({});
  }

  async findById(userId: string) {
    return await this.prismaService.user.findUnique({ where: { id: +userId } });
  }

  async findByEmail(userEmail: string) {
    return await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });
  }

  async signup(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const newUser = await this.prismaService.user.create({
      data: { email: createUserDto.email, password: createUserDto.password },
    });
    return {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  async updateOne(userId: string, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: {
        id: Number(userId),
      },
      data: updateUserDto,
    });
  }

  async deleteOne(userId: string) {
    try {
      return await this.prismaService.user.delete({ where: { id: +userId } });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`User with the id ${userId} not found`);
      }
    }
  }
}
