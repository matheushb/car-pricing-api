import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    console.log(req.user);
  }
}