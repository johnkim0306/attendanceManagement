'use server';
import { Provider } from '@/server/provider';
import { AttendanceRecordService } from '@/server/service/attendancerecord.service';
import { Session } from 'next-auth';

interface CheckInOutResult {
  success: boolean;
  timestamp?: string;
  message?: string;
}

interface fetchDateResult {
  success: boolean;
  timestamp?: string;
  message?: string;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export async function checkIn(session: Session | null): Promise<CheckInOutResult> {
  console.log("inside action.ts!!");

  if (!session) {
    console.error('User is not authenticated');
    return { success: false, message: 'User is not authenticated' };
  }
  console.log("inside action.ts");
  console.log(session);

  const AttendanceRecordServices = Provider.getService(AttendanceRecordService);

  const userId = session.user?.id;
  console.log("userId:? ", userId);

  try {
    const createdRecord = await AttendanceRecordServices.create(userId as number);
    console.log('Attendance record created:', createdRecord);

    return { success: true, timestamp: createdRecord.checkIn, ...createdRecord };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function checkOut(session: Session | null): Promise<CheckInOutResult> {
  console.log("inside action.ts and checkout function!!");

  if (!session) {
    console.error('User is not authenticated');
    return { success: false, message: 'User is not authenticated' };
  }
  console.log("inside action.ts");
  console.log(session);
  const userId = session.user?.id;
  console.log("UserId: ", userId);

  const AttendanceRecordServices = Provider.getService(AttendanceRecordService);
  console.log("About to pass in", AttendanceRecordServices);
  try {
    const checkoutTime = await AttendanceRecordServices.checkOut(userId as number);
    console.log('Checkout Time is: ', checkoutTime);

    return { success: true, timestamp: checkoutTime.checkOut, ...checkoutTime };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function fetchUserRecordsByDate(session: Session | null, value: Value): Promise<fetchDateResult> {
  if (!session) {
    console.error('User is not authenticated');
    return { success: false, message: 'User is not authenticated' };
  }

  const AttendanceRecordServices = Provider.getService(AttendanceRecordService);
  const userId = session.user?.id;

  console.log("userId: ", userId);
  console.log("Value: ", value);

  try {
    let fromDate: Date | null;
    let toDate: Date | null;

    if (Array.isArray(value)) {
      // Parse the date range from the value array
      fromDate = new Date(value[0] as unknown as string);
      toDate = new Date(value[1] as unknown as string);
    } else {
      fromDate = null;
      toDate = null;
    }

    console.log(fromDate);
    console.log(toDate);

    // Call the method in AttendanceRecordService to fetch records by date range
    const records = await AttendanceRecordServices.fetchRecordsByDateRange(userId as number, fromDate, toDate);

    // Convert the records to plain objects
    const plainRecords = records.map(record => ({
      ...record,
      checkIn: record.checkIn.toISOString(),
      checkOut: record.checkOut ? record.checkOut.toISOString() : null,
    }));

    return { success: true, records: plainRecords };
  } catch (error) {
    console.error('Error fetching records:', error);
    return { success: false, message: error.message };
  }
}