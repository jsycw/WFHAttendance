import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('employee')
export class EmployeeController {

  constructor(private employeeService: EmployeeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() body: any, @Request() req) {
    if (req.user.role !== 'hrd') {
      throw new Error("Only HRD can create employee");
    }
    return this.employeeService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: any,
    @Request() req
  ) {
    if (req.user.role !== 'hrd') {
      throw new Error("Only HRD can update employee");
    }
    return this.employeeService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @Request() req
  ) {
    if (req.user.role !== 'hrd') {
      throw new Error("Only HRD can delete employee");
    }
    return this.employeeService.delete(id);
  }

  @Get("count")
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('hrd')
  async count() {
    return this.employeeService.count();
  }

}