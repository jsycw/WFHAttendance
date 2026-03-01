import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async checkin(employee_id: number, photo: string) {
    const attendance = this.attendanceRepository.create({
      photo,
      checkin_time: new Date(),
      employee: { id: employee_id }
    });
    return this.attendanceRepository.save(attendance);
  }

  async findAll() {
    return this.attendanceRepository.find({
      relations: ['employee'],
      order: {
        checkin_time: 'DESC'
      },
    });
  }

  async findMyAttendance(employee_id: number) {
    return this.attendanceRepository.find({
      where: {
        employee: { id: employee_id }
      },
      relations: ['employee'],
      order: {
        checkin_time: 'DESC'
      },
    });
  }

  async checkToday(employee_id: number) {
    const today = new Date();
    today.setHours(0,0,0,0);
    return this.attendanceRepository.findOne({
      where: {
        employee: { id: employee_id },
        checkin_time: MoreThanOrEqual(today),
      },
      relations: ['employee']
    });
  }

  async countToday() {
    const today = new Date();
    today.setHours(0,0,0,0);
    return this.attendanceRepository.count({
      where: {
        checkin_time: MoreThanOrEqual(today)
      }
    });
  }

  async countUniqueEmployeeToday() {
    const today = new Date();
    today.setHours(0,0,0,0);

    const result = await this.attendanceRepository
      .createQueryBuilder("attendance")
      .select("COUNT(DISTINCT attendance.employee_id)", "count")
      .where("attendance.checkin_time >= :today", { today })
      .getRawOne();

    return Number(result.count);
  }

  async getDashboardStats(totalEmployee: number) {
    const todayUnique = await this.countUniqueEmployeeToday();
    const absent = totalEmployee - todayUnique;
    const attendanceRate =totalEmployee === 0 ? 0 : Math.round((todayUnique / totalEmployee) * 100);

    return {
      totalEmployee,
      checkedInToday: todayUnique,
      absentToday: absent,
      attendanceRate
    };
  }

}