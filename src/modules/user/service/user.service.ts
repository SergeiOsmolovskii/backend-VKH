import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { generatePasswordHash } from '../../../utils/passwordHashGenerator';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async createUser(userDto: CreateUserDto) {
    const isCurrentLoginInDB = await this.usersRepository.findOne({where: {login: userDto.login}});
    const isCurrentEmailInDB = await this.usersRepository.findOne({where: {email: userDto.email}});
    
    if (isCurrentLoginInDB) throw new ForbiddenException(`User with the same login already exists`);
    if (isCurrentEmailInDB) throw new ForbiddenException(`User with the same email already exists`);

    const passwordAsHash = await generatePasswordHash(userDto.password);
    const newUserData = {...userDto, password: passwordAsHash, id: uuid(), version: 1};
    const createdUser = this.usersRepository.create(newUserData);
    return (await this.usersRepository.save(createdUser)).toResponse();
  }

  public async getAllUsers() {
    return (await this.usersRepository.find()).map(user => user.toResponse());
  }

  public async getUserById(id: string) {
    const currentUser = await this.usersRepository.findOneBy({id});
    if (!currentUser) throw new NotFoundException(`User with ${id} not found`);
    return currentUser.toResponse();
  }

  public async updateUserPassword(id: string, updateUserDto: UpdateUserDto) {
    const currentUser = await this.usersRepository.findOneBy({id});
    if (!currentUser) throw new NotFoundException(`User with ${id} not found`);
    const isValid = bcrypt.compare(updateUserDto.oldPassword, currentUser.password);    
    if (!isValid) throw new ForbiddenException('Old password is incorrect');

    const newPasswordAsHash = await generatePasswordHash(updateUserDto.newPassword);
    const updatedUserData = {...updateUserDto, password: newPasswordAsHash, version: currentUser.version +1};
    const updatedUser = this.usersRepository.merge(currentUser, updatedUserData);
    return (await this.usersRepository.save(updatedUser)).toResponse();
  }

  public async deleteUser(id: string) {
    const currentUser = await this.usersRepository.findOneBy({id});
    if (!currentUser) throw new NotFoundException(`User with ${id} not found`);
    await this.usersRepository.delete(currentUser._id);
  }
}
