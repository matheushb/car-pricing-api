import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';

@Controller('/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Patch('/:id')
  updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Delete('/:id')
  deleteOne(@Param('id') id: string) {
    return this.usersService.deleteOne(id);
  }
}
