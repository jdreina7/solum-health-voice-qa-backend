import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RolesService } from '../../../src/roles/roles.service';
import { RoleType } from '../../../src/roles/role-type.enum';
import type { Role, User } from '../../../prisma/generated/client';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let rolesService: RolesService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockRolesService = {
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockRole = {
        id: 1,
        name: RoleType.USER,
        description: 'Regular user',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: mockRole,
      };

      mockRolesService.findByName.mockResolvedValue(mockRole);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: RoleType.USER,
      });

      expect(result).toEqual(mockUser);
      expect(mockRolesService.findByName).toHaveBeenCalledWith(RoleType.USER);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          roleId: 1,
        },
      });
    });

    it('should throw an error if role is not found', async () => {
      mockRolesService.findByName.mockResolvedValue(null);

      await expect(
        service.create({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: RoleType.USER,
        }),
      ).rejects.toThrow('Role not found');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: {
          id: 1,
          name: RoleType.USER,
          description: 'Regular user',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { role: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'test1@example.com',
          password: 'hashedPassword1',
          name: 'Test User 1',
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: {
            id: 1,
            name: RoleType.USER,
            description: 'Regular user',
          },
        },
        {
          id: 2,
          email: 'test2@example.com',
          password: 'hashedPassword2',
          name: 'Test User 2',
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: {
            id: 2,
            name: RoleType.ADMIN,
            description: 'Administrator',
          },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: { role: true },
      });
    });
  });
}); 