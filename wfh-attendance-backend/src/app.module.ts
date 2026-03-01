import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'wfh_attendance',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmployeeModule,
    AttendanceModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}