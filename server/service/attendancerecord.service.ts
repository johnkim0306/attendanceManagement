import { IsNull, MoreThan, LessThan, Repository } from 'typeorm';
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

    // Set status based on check-in time
    const checkInHour = newAttendanceRecord.checkIn.getHours();
    if (checkInHour >= 10) {
      newAttendanceRecord.status = 'late';
    } else {
      newAttendanceRecord.status = 'on-time';
    }

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

  async hasCheckedInWithinThirtyMinutes(userId: number): Promise<boolean> {
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const recentAttendanceRecord = await this.AttendanceRecordRepository.findOne({
      where: { 
        user: { id: userId },
        checkIn: MoreThan(thirtyMinutesAgo),
        checkOut: IsNull(),
      }
    });

    return !!recentAttendanceRecord;
}

  async fetchRecordsByDateRange(userId: number, fromDate: Date, toDate: Date) {
    if (fromDate > toDate) {
      throw new Error('Invalid date range: fromDate cannot be after toDate.');
    }

    const records = await this.AttendanceRecordRepository.find({
      where: {
        user: { id: userId },
        checkIn: MoreThan(fromDate),
        checkOut: LessThan(toDate),
      },
      order: { checkIn: 'ASC' },
    });

    if (records.length === 0) {
      console.log(`No attendance records found for user ${userId} in the given date range.`);
    }

    return records.map(record => ({
      ...record,
      user: { id: record.user.id } // Convert user to a plain object
    }));
  }

  async getOnTimeToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.AttendanceRecordRepository.count({ where: { status: 'on-time', date: MoreThan(today) } });
    } catch (error) {
      console.error('Error in getOnTimeToday:', error);
      throw error;
    }
  }

  async getLateToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.AttendanceRecordRepository.count({ where: { status: 'late', date: MoreThan(today) } });
    } catch (error) {
      console.error('Error in getLateToday:', error);
      throw error;
    }
  }

  async getOnTimePercentage(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const total = await this.AttendanceRecordRepository.count({ where: { date: MoreThan(today) } });
      if (total === 0) return 0;
      const onTime = await this.AttendanceRecordRepository.count({ where: { status: 'on-time', date: MoreThan(today) } });
      return (onTime / total) * 100;
    } catch (error) {
      console.error('Error in getOnTimePercentage:', error);
      throw error;
    }
  }

}