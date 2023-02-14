import { Entity, ObjectIdColumn, PrimaryColumn, Column } from 'typeorm';

@Entity('projects')

export class ProjectsEntity {

  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  project_code: string;

  @Column()
  project_name: string;

  @Column()
  project_status: string;

  @Column()
  pdf: Buffer;

  @Column()
  date: string;

  @Column()
  conclusion_number: string;
}