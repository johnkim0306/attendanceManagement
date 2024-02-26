import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './core/BaseEntity';

@Entity()
export class AttendanceRecord extends BaseEntity {
  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column()
  checkIn: Date;

  @Column({ nullable: true })
  checkOut: Date;
}
