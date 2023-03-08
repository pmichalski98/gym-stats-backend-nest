import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from '../auth/dtos/auth.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Prisma } from '@prisma/client';

@Serialize(UserDto)
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/test')
  whoAmI(@CurrentUser() currentUser: User) {
    return currentUser;
  }
  @Post('/signasdup')
  async createUser(@Body() body: AuthDto, @Session() session: any) {
    return 'ok';
  }
  @Get()
  findUsers() {
    return this.usersService.findALl();
  }
  @Get(':id')
  findUser(@Param('id') id: Prisma.UserWhereUniqueInput) {
    return this.usersService.findBy(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: Prisma.UserWhereUniqueInput,
    @Body() dataToUpdate: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(dataToUpdate, id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: Prisma.UserWhereUniqueInput) {
    return this.usersService.delete(id);
  }
}
