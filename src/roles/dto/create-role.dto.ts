import { IsEnum } from 'class-validator';
import { RoleType } from '../role-type.enum';

export class CreateRoleDto {
  @IsEnum(RoleType)
  name: RoleType;
} 