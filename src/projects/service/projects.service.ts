import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsEntity } from '../entity/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { v4 as uuid } from 'uuid';
const FormData = require('form-data');

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>
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
      const savedFile = await this.saveFile(file, projectDto.projectName);
      const uploadUrl = await this.getUrlToUploadFile(projectDto.projectName);
      const filePath = path.join(__dirname, '..', '..', '..', savedFile.path);
      await this.uploadFile(uploadUrl, filePath);
      fileLink = await this.getLinkToDownloadFile(projectDto.projectName);
    }
    const projectData = { ...projectDto, id: uuid(), fileLink };
    const newProject = this.projectsRepository.create(projectData);
    return await this.projectsRepository.save(newProject);
  }

  public async saveFile(file: Express.Multer.File, fileName: string): Promise<{ path: string; size: number; mimetype: string }> {
    if (!file) {
      throw new Error('File is undefined');
    }
    const path = `./uploads/Заключение ${fileName.toLocaleLowerCase()}.pdf`;
    fs.rename(file.path, path, (err) => {
      if (err) throw err;
    });
    return { path, size: file.size, mimetype: file.mimetype };
  }

  private getUrlToUploadFile = async (fileName: string) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://cloud-api.yandex.net/v1/disk/resources/upload?path=/Conclusions/Заключение ${fileName.toLocaleLowerCase()}.pdf`,
        headers: {
          'Authorization': `OAuth ${process.env.YANDEX_TOKEN}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data.href;
    } catch (error) {
      console.error(error);
    }
  }
  
  private uploadFile = async (uploadUrl: string, filePath: string) => {
    try {
      const fileStream = fs.createReadStream(filePath);
      const formData = new FormData();
      formData.append('file', fileStream);
      const response = await axios({
        method: 'PUT',
        url: uploadUrl,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  private getLinkToDownloadFile  = async (fileName: string) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://cloud-api.yandex.net/v1/disk/resources/download?path=/Conclusions/Заключение ${fileName.toLocaleLowerCase()}.pdf`,
        headers: {
          'Authorization': `OAuth ${process.env.YANDEX_TOKEN}`,
          'Content-Type': 'application/json'
        },
      })
      return response.data.href;
    } catch (error) {
      console.error(error);
    }
  }
}