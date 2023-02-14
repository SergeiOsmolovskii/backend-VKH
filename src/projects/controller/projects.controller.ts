import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectsEntity } from '../entity/project.entity';
import { ProjectsService } from '../service/projects.service';

@Controller('projects')

export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllProjects(): Promise<ProjectsEntity[]>  {
    return this.projectService.getAllProjects();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async addProject(@Body() newProject: CreateProjectDto): Promise<ProjectsEntity> {
    return this.projectService.addProject(newProject);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getProjectById(@Param('id') id: string): Promise<ProjectsEntity> {
    return this.projectService.getProjectById(id);
  }
}
