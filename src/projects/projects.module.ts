import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEntity } from './entity/project.entity'
import { ProjectsController } from './controller/projects.controller';
import { ProjectsService } from './service/projects.service'
import { MulterModule } from '@nestjs/platform-express';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DB_URL,
      entities: [ProjectsEntity],
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([ProjectsEntity]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})


export class ProjectsModule {}
