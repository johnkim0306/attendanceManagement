import { Column, Entity, ManyToOne, Index  } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './core/BaseEntity';

@Entity()
@Index(['date', 'user'], { unique: true }) // Prevent duplicate attendance records for the same day
export class AttendanceRecord extends BaseEntity {
  @ManyToOne(() => User, user => user.attendanceRecords, { eager: true })
  user: Relation<User>;

  @Column({ type: 'timestamp', nullable: true })
  checkIn: Date;

  @Column({ nullable: true })
  checkOut: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP ' })
  date: Date;

  @Column({ type: 'enum', enum: ['on-time', 'late', 'absent'], default: 'absent' })
  status: 'on-time' | 'late' | 'absent';
}
