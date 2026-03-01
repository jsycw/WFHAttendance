import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmployeeModule } from '../employee/employee.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    EmployeeModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}