import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { TokenDto } from '../dto/token.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) { }

  public async signin(body: SignInDto): Promise<TokenDto> {
    const user = await this.usersRepository.findOne({ select: ['id', 'password'], where: { login: body.login } });
    if (!user) {
      throw new HttpException('User was not founded!', HttpStatus.FORBIDDEN);
    }
    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      throw new HttpException('User password is invalid!', HttpStatus.FORBIDDEN);
    }
    return this.genereateToken(user.id, body.login);
  }

  public async refresh(body: RefreshTokenDto): Promise<TokenDto> {
    const refreshToken = body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    return this.refreshToken(refreshToken);
  }

  private refreshToken(refreshToken: string): TokenDto {
    try {
      const verifyToken = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET_REFRESH_KEY });
      if (Date.now() > verifyToken.exp * 1000) {
        throw new ForbiddenException('Refresh token expired');
      }
      return this.genereateToken(verifyToken.userId, verifyToken.login);
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }
  }

  private genereateToken(userId: string, login: string): TokenDto {
    const accessToken = this.jwtService.sign({ userId, login }, { expiresIn: process.env.TOKEN_EXPIRE_TIME });
    const refreshToken = this.jwtService.sign({ userId, login }, { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME });
    return { accessToken, refreshToken };
  }
}