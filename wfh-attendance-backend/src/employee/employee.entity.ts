import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';

import { Attendance } from '../attendance/attendance.entity';

@Entity()
export class Employee {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'employee' })
  role: string;

  @Column({ nullable: true })
  department: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Attendance, attendance => attendance.employee)
  attendances: Attendance[];

}