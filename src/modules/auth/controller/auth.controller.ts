import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserService } from '../../user/service/user.service';
import { TokenDto } from '../dto/token.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private usersService: UserService) {}

  @Post('/signup')
  public signup(@Body() body: CreateUserDto): Promise<CreateUserDto> {
    return this.usersService.createUser(body);
  }

  @Post('/signin') 
  public signin(@Body() body: SignInDto): Promise<TokenDto> {
    return this.authService.signin(body);
  }

  @Post('/refresh')
  public refresh(@Body() body: RefreshTokenDto): Promise<TokenDto> {
    return this.authService.refresh(body);
  }
}
