import { NextRequest, NextResponse } from 'next/server';
import { Provider } from '@/server/provider';
import { AttendanceRecordService } from '@/server/service/attendancerecord.service';

export async function GET(req: NextRequest) {
  const attendanceRecordService = Provider.getService(AttendanceRecordService);

  try {
    const onTimePercentage = await attendanceRecordService.getOnTimePercentage();
    return NextResponse.json({ onTimePercentage });
  } catch (error) {
    console.error('Error fetching on-time percentage:', error);
    return NextResponse.json({ error: 'Error fetching on-time percentage' }, { status: 500 });
  }
}