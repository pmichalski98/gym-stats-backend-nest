import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findById(id: number) {
        return Promise.resolve({
          id,
          email: 'asd@asd.com',
          password: 'asdf',
        } as User);
      },
      findByEmail(email: string): Promise<User[]> {
        return Promise.resolve([{ id: 1, email, password: 'asd' }] as User[]);
      },
      findALl(): Promise<User[]> {
        return Promise.resolve([
          { id: 1, email: 'asd@asd.com', password: 'asd' },
        ] as User[]);
      },
      // delete(id: number): Promise<number> {
      // },
      //  update(id: number, dataToUpdate: UpdateUserDto) {
      // },
    };

    fakeAuthService = {
      // signUp: () => {};
      // signIn: () => {};
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('findallusers return user with provided email', async () => {
    const result = await controller.findUsers();
    console.log(result);
    expect(result.length).toEqual(1);
  });

  it('returns user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
