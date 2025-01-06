import { Column, Entity, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './core/BaseEntity';

@Entity()
export class AttendanceRecord extends BaseEntity {
  @ManyToOne(() => User, user => user.attendanceRecords, { eager: true })
  user: Relation<User>;

  @Column()
  checkIn: Date;

  @Column({ nullable: true })
  checkOut: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP ' })
  date: Date;

  @Column({ type: 'varchar', nullable: true })
  status: 'on-time' | 'late';
}
