import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {  
  @IsString()
  @IsNotEmpty()
  readonly login!: string;
  
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}