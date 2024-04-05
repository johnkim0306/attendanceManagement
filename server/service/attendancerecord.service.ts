import { IsNull, Repository } from 'typeorm';
import { AttendanceRecord } from '../db/entities/AttendanceRecord';
import { User } from '../db/entities/User';
import { Inject, InjectRepository, Service } from '../provider';
import { UserService } from './user.service';

@Service
export class AttendanceRecordService {
  @InjectRepository(AttendanceRecord) AttendanceRecordRepository: Repository<AttendanceRecord>;
  @InjectRepository(User) userRepository: Repository<User>;
  // @Inject(UserService) userService:UserService; // inject other service

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

  async checkOut(userId: number) {
    console.log("Inside checkOut function bro");
    const user = await this.userRepository.findOneBy({id:userId});
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    console.log("Inside UpdateCheckOut");
    console.log(user);

    // Find the most recent attendance record for the user
    // const recentAttendanceRecord = await this.AttendanceRecordRepository.findOne({
    //   where: { 
    //     id: userId,
    //     checkOut: IsNull(),
    //   },
    //   order: { 
    //     checkIn: 'DESC' 
    //   },
    // });

    // const recentAttendanceRecord = await this.AttendanceRecordRepository.findOne({
    //   where: { id: userId, checkOut: IsNull() },
    //   order: { checkIn: 'DESC' },
    // });    

    // Create a query builder
    const qb = this.AttendanceRecordRepository.createQueryBuilder('attendanceRecord');

    // Find the most recent attendance record for the user with null checkOut
    const recentAttendanceRecord = await qb
      .where('attendanceRecord.user.id = :userId', { userId })
      .andWhere('attendanceRecord.checkOut IS NULL')
      .orderBy('attendanceRecord.checkIn', 'DESC')
      .getOne();

    console.log("Recent Attendance Record:");
    console.log(recentAttendanceRecord);
    if (!recentAttendanceRecord) {
      throw new Error(`No open attendance record found for user with ID ${userId}`);
    }
    console.log("Swag");
    recentAttendanceRecord.checkOut = new Date();
    return this.AttendanceRecordRepository.save(recentAttendanceRecord);
  }

  async fetchRecordsByDateRange(userId: number,fromDate: Date, toDate: Date) {
    console.log("Inside attendanceRecord.service ", fromDate)
    console.log("Inside attendanceRecord.service ", toDate)
    return null;
  }
}