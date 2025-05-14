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
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GoogleSheetsModule } from './google-sheets/google-sheets.module';
import { PrismaService } from './prisma/prisma.service';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    HealthModule,
    CompanyModule,
    AgentModule,
    CallModule,
    EvaluationModule,
    ImportModule,
    UsersModule,
    RolesModule,
    GoogleSheetsModule,
    LoginModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    PrismaService,
  ],
})
export class AppModule {}
