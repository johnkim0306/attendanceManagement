import { NextRequest, NextResponse } from 'next/server';
import { Provider } from '@/server/provider';
import { AttendanceRecordService } from '@/server/service/attendancerecord.service';

export async function GET(req: NextRequest) {
  const attendanceRecordService = Provider.getService(AttendanceRecordService);

  try {
    const onTimeToday = await attendanceRecordService.getOnTimeToday();
    return NextResponse.json({ onTimeToday });
  } catch (error) {
    console.error('Error fetching on time today:', error);
    return NextResponse.json({ error: 'Error fetching on time today' }, { status: 500 });
  }
}