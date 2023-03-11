import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@UseGuards(AuthGuard)
@Serialize(UserDto)
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  getMe(@Session() session: any) {
    return session.userId;
  }
  @Get()
  findUsers() {
    return this.usersService.findALl();
  }
  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch()
  updateUser(@Session() session: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(session.userId, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
