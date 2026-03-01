import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { AttendanceService } from './attendance.service';
import { EmployeeService } from '../employee/employee.service';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@Controller('attendance')
export class AttendanceController {

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
  ) {}

  @Post('checkin')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const filename =
          Date.now() + '-' + file.originalname;
        callback(null, filename);
      }
    })
  }))

  async checkin(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const employee_id = req.user.userId;
    return this.attendanceService.checkin(
      employee_id,
      file.filename
    );
  }

  @Get("all")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('hrd')
  async findAll() {
    return this.attendanceService.findAll();
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async myAttendance(@Request() req) {
    const employee_id = req.user.userId;
    return this.attendanceService
      .findMyAttendance(employee_id);
  }

  @Get("today")
  @UseGuards(AuthGuard("jwt"))
  async checkToday(@Request() req) {
    return this.attendanceService.checkToday(
      req.user.userId
    );
  }

  @Get("count/today")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('hrd')
  async countToday() {
    return this.attendanceService
      .countUniqueEmployeeToday();
  }

  @Get("stats")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('hrd')
  async stats() {
    const totalEmployee = await this.employeeService.count();
    return this.attendanceService.getDashboardStats(totalEmployee);
  }

}