import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Definir el enum RoleType localmente para evitar el error de linter
enum RoleType {
  USER = 'USER',
  EVALUATOR = 'EVALUATOR',
  ADMIN = 'ADMIN',
}

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleType.USER, RoleType.EVALUATOR, RoleType.ADMIN)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.USER, RoleType.EVALUATOR, RoleType.ADMIN)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  create(@Body() createRoleDto: { name: RoleType; description?: string }) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  update(@Param('id') id: string, @Body() updateRoleDto: { name?: RoleType; description?: string }) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleType.ADMIN)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
} 