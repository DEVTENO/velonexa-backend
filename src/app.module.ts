import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h',
          algorithm: 'HS256',
          issuer: 'velonexa',
          audience: 'velonexa-frontend',
          subject: 'user-authentication',
        },
        verifyOptions: {
          algorithms: ['HS256'],
          issuer: ['velonexa'],
          audience: ['velonexa-frontend'],
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
