import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Employee } from '../employee/employee.entity';

@Entity()
export class Attendance {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photo: string;

  @Column()
  checkin_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Employee, employee => employee.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

}