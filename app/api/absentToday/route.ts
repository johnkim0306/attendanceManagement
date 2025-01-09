import { NextRequest, NextResponse } from 'next/server';
import { Provider } from '@/server/provider';
import { AttendanceRecordService } from '@/server/service/attendancerecord.service';

export async function GET(req: NextRequest) {
  const attendanceRecordService = Provider.getService(AttendanceRecordService);

  try {
    const absentRecords = await attendanceRecordService.getAbsentToday();
    console.log('Absent Records:', absentRecords);
    return NextResponse.json({ absentRecords });
  } catch (error) {
    console.error('Error fetching absent records:', error);
    return NextResponse.json({ error: 'Error fetching absent records' }, { status: 500 });
  }
}