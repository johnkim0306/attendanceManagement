import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany} from 'typeorm';
import type { Relation } from 'typeorm';
import bcrypt from 'bcryptjs';
import { BaseEntity } from './core/BaseEntity';
import { AttendanceRecord } from './AttendanceRecord';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User extends BaseEntity{

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => AttendanceRecord, attendanceRecord => attendanceRecord.user)
  attendanceRecords: Relation<AttendanceRecord[]>;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) {
      return;
    }
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update password');
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update password');
    }
  }
}
