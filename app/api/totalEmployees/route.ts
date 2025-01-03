// app/api/totalEmployees/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Provider } from '@/server/provider';
import { UserService } from '@/server/service/user.service';

export async function GET(req: NextRequest) {
  const userService = Provider.getService(UserService);

  try {
    const totalEmployees = await userService.getTotalEmployees();
    return NextResponse.json({ totalEmployees });
  } catch (error) {
    console.error('Error fetching total employees:', error);
    return NextResponse.json({ error: 'Error fetching total employees' }, { status: 500 });
  }
}
