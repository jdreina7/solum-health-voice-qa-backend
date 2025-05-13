import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CompanyModule } from './company/company.module';
import { AgentModule } from './agent/agent.module';
import { CallModule } from './call/call.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { ImportModule } from './import/import.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 5,
      ignoreUserAgents: [],
    }]),
    PrismaModule,
    HealthModule,
    CompanyModule,
    AgentModule,
    CallModule,
    EvaluationModule,
    ImportModule,
    AuthModule,
    UsersModule,
    RolesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
