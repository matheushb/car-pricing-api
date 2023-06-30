import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

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
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async updateOne(userId: string, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: {
        id: +userId,
      },
      data: updateUserDto,
    });
  }

  async deleteOne(userId: string) {
    return await this.prismaService.user.delete({ where: { id: +userId } });
  }
}
