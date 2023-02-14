import { Injectable, NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entity/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
  ) {}

  public async getAllProjects(): Promise<ProjectsEntity[]> {
    return await this.projectsRepository.find();
  }

  public async getProjectById(id: string): Promise<ProjectsEntity> {
    const currentProject = await this.projectsRepository.findOneBy({id});
    if (!currentProject) throw new NotFoundException(`Project with ${id} not found`);
    return currentProject;
  }

  public async addProject(projectDto: CreateProjectDto): Promise<ProjectsEntity> {
    const projectData = {...projectDto, id: uuid()};
    const newProject = this.projectsRepository.create(projectData);  
    return await this.projectsRepository.save(newProject);
  }
}