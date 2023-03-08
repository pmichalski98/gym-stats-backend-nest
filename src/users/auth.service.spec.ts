import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import { faker } from '@faker-js/faker';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findByEmail: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: parseInt(faker.database.mongodbObjectId()),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('asdf@asdf.com', 'asdasd');
    await expect(service.signUp('asdf@asdf.com', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('has hashed password with salt', async () => {
    const user = await service.signUp('asd@asd.com', 'password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user tries to signin with an email that is not defined', async () => {
    await expect(service.signIn('asds@asd.com', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws error if an invalid password is provided', async () => {
    await service.signUp('asd@asd.com', 'pass');
    await expect(service.signIn('asd@asd.com', 'pass123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns user if correct password is provided', async () => {
    await service.signUp('asd@asd.com', 'pass');
    const user = await service.signIn('asd@asd.com', 'pass');
    expect(user).toBeDefined();
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
});
