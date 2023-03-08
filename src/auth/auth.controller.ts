import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/check')
  getSignedUser(@Session() session: any) {
    console.log(session.userId);
    return session.userId;
  }
  @Post('/signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  @Post('/signin')
  async signIn(@Body() dto: AuthDto, @Session() session: any) {
    const user = await this.authService.signIn(dto);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return 'signed out';
  }
}
