import { NextRequest, NextResponse } from 'next/server';
import { Provider } from '@/server/provider';
import { AttendanceRecordService } from '@/server/service/attendancerecord.service';

export async function GET(req: NextRequest) {
  const attendanceRecordService = Provider.getService(AttendanceRecordService);

  try {
    const lateToday = await attendanceRecordService.getLateToday();
    return NextResponse.json({ lateToday });
  } catch (error) {
    console.error('Error fetching late today:', error);
    return NextResponse.json({ error: 'Error fetching late today' }, { status: 500 });
  }
}