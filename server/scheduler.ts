import cron from 'node-cron';
import { Provider } from './provider';
import { AttendanceRecordService } from './service/attendancerecord.service';

let cronJobInitialized = false; // Flag to track cron job initialization

const initializeCronJob = async () => {
  if (cronJobInitialized) {
    console.log("Cron job is already initialized.");
    return;
  }

  console.log("Cron job is starting.");
  const attendanceRecordService = Provider.getService(AttendanceRecordService);

  // Check if attendance records exist for today when the application starts
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight
  const recordsExist = await attendanceRecordService.checkAttendanceRecordsForToday(today);

  if (!recordsExist) {
    console.log('Attendance records not found for today. Creating them now...');
    try {
      await attendanceRecordService.preRecordAbsences();
      console.log('Attendance records created successfully.');
    } catch (error) {
      console.error('Error creating attendance records at startup:', error);
    }
  } else {
    console.log('Attendance records for today already exist.');
  }

  // Schedule cron job to run at midnight every day
  cron.schedule('0 0 * * *', async () => {
    console.log('Running pre-record absence task...');
    try {
      await attendanceRecordService.preRecordAbsences();
      console.log('Pre-record absence task completed successfully.');
    } catch (error) {
      console.error('Error running pre-record absence task:', error);
    }
  }, {
    scheduled: true,
    timezone: "America/Toronto", // Adjust timezone as needed
  });

  cronJobInitialized = true; 
};

export { initializeCronJob };
