import { NextApiRequest, NextApiResponse } from 'next';
import { initializeCronJob } from '@/server/scheduler';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    initializeCronJob();
    res.status(200).json({ message: 'Cron job started' });
}
