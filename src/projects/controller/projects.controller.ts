import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectsEntity } from '../entity/project.entity';
import { ProjectsService } from '../service/projects.service';
import * as fs from 'fs';
import { promisify } from 'util';

@Controller('projects')

export class ProjectsController {
  constructor(private projectService: ProjectsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllProjects(): Promise<ProjectsEntity[]> {
    return this.projectService.getAllProjects();
  }

  @Get('uploads/:imagename')
  @HttpCode(HttpStatus.OK)
  public async getImage(@Param('imagename') path: string, @Res() res): Promise<void> {
    try {
      const file = await promisify(fs.readFile)(`uploads/${path}`);
      res.type('application/pdf').send(file);
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  public async addProject(
    @UploadedFile() file: Express.Multer.File,
    @Body() newProject: CreateProjectDto): Promise<ProjectsEntity> {
    return this.projectService.addProject(newProject, file);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getProjectById(@Param('id') id: string): Promise<ProjectsEntity> {
    return this.projectService.getProjectById(id);
  }
}
