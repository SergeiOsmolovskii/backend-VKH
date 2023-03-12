import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {

  @IsString()
  @IsNotEmpty()
  projectCode: string;

  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  @IsNotEmpty()
  conclusionStatus: string;

  @IsString()
  @IsNotEmpty()
  conclusionDate: string;

  @IsString()
  @IsNotEmpty()
  conclusionNumber: string;
}