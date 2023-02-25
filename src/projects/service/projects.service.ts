import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entity/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { v4 as uuid } from 'uuid';
import { uploadFile } from '../../utils/files';
import * as fs from 'fs';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
  ) { }

  public async getAllProjects(): Promise<ProjectsEntity[]> {
    return await this.projectsRepository.find();
  }

  public async getProjectById(id: string): Promise<ProjectsEntity> {
    const currentProject = await this.projectsRepository.findOneBy({ id });
    if (!currentProject) throw new NotFoundException(`Project with ${id} not found`);
    return currentProject;
  }

  public async addProject(projectDto: CreateProjectDto, file: Express.Multer.File): Promise<ProjectsEntity> {
    let fileLink: string;
    if (file) {
      const savedFile = await this.saveFile(file);
      fileLink = savedFile.path;
    }
    const projectData = { ...projectDto, id: uuid(), fileLink };
    const newProject = this.projectsRepository.create(projectData);
    return await this.projectsRepository.save(newProject);
  }

  public async saveFile(file: Express.Multer.File): Promise<{ path: string; size: number; mimetype: string }> {
    if (!file) {
      throw new Error('File is undefined');
    }

    const path = `./uploads/${file.originalname}`;

    fs.rename(file.path, path, (err) => {
      if (err) throw err;
      console.log('renamed complete');
    });

    // await uploadFile(path);
    //   fs.unlink(path, (err) => {
    //   if (err) throw err;
    //   console.log('deleted complete');
    // });

    return { path, size: file.size, mimetype: file.mimetype };
  }
}