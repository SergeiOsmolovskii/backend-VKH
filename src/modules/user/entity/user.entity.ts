import { Column, CreateDateColumn, Entity, ObjectIdColumn, PrimaryColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('user')

export class UserEntity {
  
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @VersionColumn({default: 1})
  version: number;
  
  @CreateDateColumn({ type: 'timestamp', nullable: true, default: () => "CURRENT_TIMESTAMP()" })
  createdAt: number;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => "CURRENT_TIMESTAMP()", onUpdate: "CURRENT_TIMESTAMP()" })
  updatedAt: number;

  public toResponse() {
    const { id, login, createdAt, updatedAt, version, email } = this;
    return { id, login, createdAt: +new Date(createdAt), updatedAt: +updatedAt, version, email };
  }
}
