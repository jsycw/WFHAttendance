import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(data: Partial<Employee>): Promise<Employee> {

    if (!data.password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword: string = await bcrypt.hash(data.password, 10);
    const employee = this.employeeRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'employee',
    });
    return await this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return await this.employeeRepository.findOne({
      where: { email },
    });
  }

  async findOne(id: number) {

    return this.employeeRepository.findOne({
      where: { id }
    });

  }

  async update(id: number, data: any) {
    await this.employeeRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.employeeRepository.delete(id);
    return { message: "Employee deleted" };
  }

  async changePassword(id: number, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    await this.employeeRepository.update(id, {
      password: hashed
    });

    return { message: "Password updated" };
  }

  async count() {
    return this.employeeRepository.count();
  }

}