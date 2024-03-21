'use server';
import { Provider } from '@/server/provider';
import { AttendanceRecordService } from '@/server/service/attendancerecord.service';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export async function checkIn(session: Session | null) {
	console.log("inside action.ts!!")

	if (!session) {
		console.error('User is not authenticated');
		return;
	}
	console.log("inside action.ts")
	console.log(session)
	
	const AttendanceRecordServices = Provider.getService(AttendanceRecordService);

	const userId = session.user?.id;
	console.log("userId:? ", userId);

	try {
		await AttendanceRecordServices.create(userId as number );
		//console.log(JSON.stringify(result));
		// redirect('/main');
        return { success: true };
	} catch (error) {
        return { success: false, message: error };
	}
}

export async function checkOut(session: Session | null) {
	console.log("inside action.ts and checkout function!!")

	if (!session) {
		console.error('User is not authenticated');
		return;
	}
	console.log("inside action.ts")
	console.log(session)
	const userId = session.user?.id;
	console.log("UserId: ", userId);

	const AttendanceRecordServices = Provider.getService(AttendanceRecordService);
	console.log("About toe pass in");
	try {
		await AttendanceRecordServices.checkOut(userId as number)
	} catch {

	}
}

