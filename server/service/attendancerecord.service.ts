import { Repository } from 'typeorm';
import { AttendanceRecord } from '../db/entities/AttendanceRecord';
import { User } from '../db/entities/User';
import { Inject, InjectRepository, Service } from '../provider';
import { UserService } from './user.service';

@Service
export class AttendanceRecordService {
  @InjectRepository(AttendanceRecord) AttendanceRecordRepository: Repository<AttendanceRecord>;
  @InjectRepository(User) userRepository: Repository<User>;
  @Inject(UserService) userService:UserService; // inject other service

  async create(userId: number) {
    const user = await this.userRepository.findOneBy({id:userId});
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    console.log("attendancerecord.service.ts inside!!");
    console.log(user);

    const newAttendanceRecord = new AttendanceRecord();
    newAttendanceRecord.checkIn = new Date();
    newAttendanceRecord.user = user;
    return this.AttendanceRecordRepository.save(newAttendanceRecord);
  }
}