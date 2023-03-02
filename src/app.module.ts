import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserEntity } from './modules/user/entity/user.entity';
import { UserModule } from './modules/user/user.module';
import { ProjectsEntity } from './projects/entity/project.entity';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DB_URL,
      entities: [ProjectsEntity, UserEntity],
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ProjectsModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }