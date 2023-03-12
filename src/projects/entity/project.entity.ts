import { Entity, ObjectIdColumn, PrimaryColumn, Column } from 'typeorm';

@Entity('projects')

export class ProjectsEntity {

  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  projectCode: string;

  @Column()
  projectName: string;

  @Column()
  conclusionStatus: string;

  @Column()
  conclusionDate: string;

  @Column()
  conclusionNumber: string;
}