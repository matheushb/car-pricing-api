import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  findAll() {
    return this.userRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with the ID ${id} not found`);
    return user;
  }

  findByEmail(email: string) {
    const user = this.userRepository.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with the email ${email} not found`);
    return user;
  }

  updateOne(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateOne(id, updateUserDto);
  }

  async deleteOne(id: string) {
    const user = await this.userRepository.deleteOne(id);
  }
}
