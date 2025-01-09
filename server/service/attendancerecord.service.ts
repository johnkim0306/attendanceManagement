import { IsNull, MoreThan, LessThan, Repository, Between } from 'typeorm';
import { AttendanceRecord } from '../db/entities/AttendanceRecord';
import { User } from '../db/entities/User';
import { Inject, InjectRepository, Service } from '../provider';
import { UserService } from './user.service';

@Service
export class AttendanceRecordService {
  @InjectRepository(AttendanceRecord) AttendanceRecordRepository: Repository<AttendanceRecord>;
  @InjectRepository(User) userRepository: Repository<User>;
  // @Inject(UserService) userService:UserService; // inject other service

  async checkAttendanceRecordsForToday(date: Date): Promise<boolean> {
    const count = await this.AttendanceRecordRepository.count({
      where: { date },
    });
    return count > 0; // Returns true if records exist, false otherwise
  }
  
  async preRecordAbsences() {
    const users = await this.userRepository.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const absenceRecords = users.map(user => {
      const record = new AttendanceRecord();
      record.user = user;
      record.date = today;
      record.status = 'absent';
      return record;
    });

    await this.AttendanceRecordRepository.save(absenceRecords);
  }

  async create(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await this.AttendanceRecordRepository.findOne({
      where: { user: { id: userId }, date: today },
    });

    if (!existingRecord) {
      throw new Error(`No pre-recorded absence found for user with ID ${userId}`);
    }

    if (existingRecord.checkIn) {
      throw new Error(`User with ID ${userId} has already checked in today`);
    }

    existingRecord.checkIn = new Date();
    const checkInHour = existingRecord.checkIn.getHours();
    existingRecord.status = checkInHour >= 10 ? 'late' : 'on-time';

    const savedRecord = await this.AttendanceRecordRepository.save(existingRecord);

    // Convert the saved record to a plain object
    const plainSavedRecord = {
      ...savedRecord,
      checkIn: savedRecord.checkIn.toISOString(),
      checkOut: savedRecord.checkOut ? savedRecord.checkOut.toISOString() : null,
      user: {
        id: savedRecord.user.id,
        email: savedRecord.user.email,
        firstname: savedRecord.user.firstname,
        lastname: savedRecord.user.lastname,
        role: savedRecord.user.role,
      },
    };

    console.log('Attendance record created:', plainSavedRecord);

    return plainSavedRecord;
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
    const savedRecord = await this.AttendanceRecordRepository.save(recentAttendanceRecord);

    // Convert the saved record to a plain object
    return {
      ...savedRecord,
      checkIn: savedRecord.checkIn.toISOString(),
      checkOut: savedRecord.checkOut ? savedRecord.checkOut.toISOString() : null,
    };
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
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      return this.AttendanceRecordRepository.count({
        where: {
          status: 'on-time',
          date: Between(today, tomorrow),
        },
      });
    } catch (error) {
      console.error('Error in getOnTimeToday:', error);
      throw error;
    }
  }

  async getLateToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      return this.AttendanceRecordRepository.count({
        where: {
          status: 'late',
          date: Between(today, tomorrow),
        },
      });
    } catch (error) {
      console.error('Error in getLateToday:', error);
      throw error;
    }
  }

  async getAbsentToday(): Promise<AttendanceRecord[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return this.AttendanceRecordRepository.find({
      where: {
        date: Between(today, tomorrow),
        status: 'absent',
      },
    });
  }

  async getOnTimePercentage(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const total = await this.AttendanceRecordRepository.count({
        where: {
          date: Between(today, tomorrow),
        },
      });
      if (total === 0) return 0;

      const onTime = await this.AttendanceRecordRepository.count({
        where: {
          status: 'on-time',
          date: Between(today, tomorrow),
        },
      });

      return (onTime / total) * 100;
    } catch (error) {
      console.error('Error in getOnTimePercentage:', error);
      throw error;
    }
  }
}