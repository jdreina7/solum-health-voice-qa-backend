import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../../../src/roles/roles.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { RoleType } from '../../../src/roles/role-type.enum';
import type { Role } from '../../../prisma/generated/client';

describe('RolesService', () => {
  let service: RolesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    role: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createRoleDto = {
      name: RoleType.USER,
      description: 'Regular user role',
    };

    const mockRole: Role = {
      id: '1',
      name: RoleType.USER,
      description: 'Regular user role',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new role', async () => {
      jest.spyOn(prismaService.role, 'create').mockResolvedValue(mockRole);

      const result = await service.create(createRoleDto);

      expect(result).toEqual(mockRole);
      expect(prismaService.role.create).toHaveBeenCalledWith({
        data: createRoleDto,
      });
    });
  });

  describe('findByName', () => {
    const roleName = RoleType.USER;
    const mockRole: Role = {
      id: '1',
      name: RoleType.USER,
      description: 'Regular user role',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return role if found', async () => {
      jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(mockRole);

      const result = await service.findByName(roleName);

      expect(result).toEqual(mockRole);
      expect(prismaService.role.findUnique).toHaveBeenCalledWith({
        where: { name: roleName },
      });
    });

    it('should return null if role not found', async () => {
      jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(null);

      const result = await service.findByName(roleName);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    const mockRoles: Role[] = [
      {
        id: '1',
        name: RoleType.USER,
        description: 'Regular user role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: RoleType.ADMIN,
        description: 'Administrator role',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all roles', async () => {
      jest.spyOn(prismaService.role, 'findMany').mockResolvedValue(mockRoles);

      const result = await service.findAll();

      expect(result).toEqual(mockRoles);
      expect(prismaService.role.findMany).toHaveBeenCalled();
    });
  });
}); 