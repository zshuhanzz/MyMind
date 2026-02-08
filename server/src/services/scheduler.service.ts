import cron from 'node-cron';
import { query } from '../config/database.js';
import logger from '../utils/logger.js';

export function initializeScheduler() {
  // Check for due check-in reminders every minute
  cron.schedule('* * * * *', async () => {
    try {
      await processCheckInReminders();
    } catch (err) {
      logger.error('Check-in reminder job failed:', err);
    }
  });

  // Expire stale pending check-ins every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const { rowCount } = await query(
        `UPDATE check_ins SET status = 'expired'
         WHERE status = 'pending' AND created_at < NOW() - INTERVAL '4 hours'`
      );
      if (rowCount && rowCount > 0) {
        logger.info(`Expired ${rowCount} stale check-ins`);
      }
    } catch (err) {
      logger.error('Stale check-in cleanup failed:', err);
    }
  });

  logger.info('Scheduler initialized');
}

async function processCheckInReminders() {
  // Find active schedules where a check-in is due
  const { rows: schedules } = await query(
    `SELECT s.*, u.timezone, u.id as uid
     FROM check_in_schedules s
     JOIN users u ON u.id = s.user_id
     WHERE s.is_active = true AND u.deleted_at IS NULL`
  );

  const now = new Date();

  for (const schedule of schedules) {
    // Check if there's already a pending check-in today
    const { rows: existing } = await query(
      `SELECT id FROM check_ins
       WHERE user_id = $1 AND status IN ('pending', 'completed')
       AND created_at::date = CURRENT_DATE`,
      [schedule.user_id]
    );

    if (existing.length > 0) continue;

    // Check if current time matches preferred time (within 1 min window)
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    const preferredTimes: string[] = schedule.preferred_times || ['09:00'];
    const isDue = preferredTimes.some((t: string) => {
      const [h, m] = t.split(':');
      return `${h}:${m}` === currentTimeStr;
    });

    if (!isDue) continue;

    // Check day of week
    const dayOfWeek = now.getUTCDay() || 7; // Convert Sunday=0 to 7
    const daysOfWeek: number[] = schedule.days_of_week || [1, 2, 3, 4, 5, 6, 7];
    if (!daysOfWeek.includes(dayOfWeek)) continue;

    // Create pending check-in
    await query(
      `INSERT INTO check_ins (user_id, schedule_id, status, prompted_at)
       VALUES ($1, $2, 'pending', NOW())`,
      [schedule.user_id, schedule.id]
    );

    logger.debug(`Created pending check-in for user ${schedule.user_id}`);
  }
}
