import { IsNotEmpty, IsString } from "class-validator";


export class CreateProjectDto {

  @IsString()
  @IsNotEmpty()
  project_code: string;

  @IsString()
  @IsNotEmpty()
  project_name: string;

  @IsString()
  @IsNotEmpty()
  project_status: string;

  @IsString()
  @IsNotEmpty()
  pdf: Buffer;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  conclusion_number: string;
}