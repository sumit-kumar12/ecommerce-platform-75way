import cron from 'node-cron';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

// Schedule: Run every day at 02:00 AM server time
const schedule = process.env.BACKUP_CRON_SCHEDULE || '0 2 * * *';

console.log(`[Backup Cron] Initializing database backup schedule: ${schedule}`);

cron.schedule(schedule, async () => {
  console.log(`[Backup Cron] Triggering scheduled database backup at ${new Date().toISOString()}`);
  
  try {
    // Determine backup path
    const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `katabazaar-auto-${timestamp}.sql`);

    // Run the backup command (which internally calls pg_dump inside Docker)
    // Here we wrap the existing npm script
    const { stdout, stderr } = await execPromise(`npm run db:backup -- -BackupPath "${backupFile}"`);
    
    console.log(`[Backup Cron] Backup completed successfully.`);
    console.log(`[Backup Cron] Output: ${stdout}`);
    
    if (stderr) {
      console.warn(`[Backup Cron] Warnings during backup: ${stderr}`);
    }
  } catch (error) {
    console.error(`[Backup Cron] CRITICAL ERROR: Database backup failed!`);
    console.error(error);
    // In a real production system, trigger an alert to PagerDuty/Slack here.
  }
});

console.log(`[Backup Cron] Service is running. Waiting for next trigger.`);
