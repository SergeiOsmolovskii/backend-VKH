import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProjectsEntity } from './entity/project.entity'
import { ProjectsController } from './controller/projects.controller';
import { ProjectsService } from './service/projects.service'
import 'dotenv/config';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([ProjectsEntity]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})


export class ProjectsModule {}
