import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SigninUserDto } from './dtos/signin-user.dto';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/test')
  @UseGuards(JwtAuthGuard)
  test(@CurrentUser() user: User) {
    console.log(user);
  }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    const { name, email, password } = body;

    return this.authService.signup(name, email, password);
  }

  @Post('/signin')
  signin(@Body() body: SigninUserDto) {
    const { email, password } = body;

    return this.authService.signin(email, password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
