import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);

async function verifyLatestBackup() {
  console.log(`[Restore Verify] Starting backup integrity verification.`);
  
  const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    console.error(`[Restore Verify] Backup directory does not exist: ${backupDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql'));
  if (files.length === 0) {
    console.error(`[Restore Verify] No backup files found in ${backupDir}`);
    process.exit(1);
  }

  // Sort to get the most recent file based on modification time
  files.sort((a, b) => fs.statSync(path.join(backupDir, b)).mtime.getTime() - fs.statSync(path.join(backupDir, a)).mtime.getTime());
  
  const latestBackup = path.join(backupDir, files[0]);
  console.log(`[Restore Verify] Testing latest backup file: ${latestBackup}`);

  try {
    // Run the existing verification script (db:backup:verify)
    const { stdout, stderr } = await execPromise(`npm run db:backup:verify -- -BackupPath "${latestBackup}"`);
    
    console.log(`[Restore Verify] Verification PASSED.`);
    console.log(stdout);
  } catch (error) {
    console.error(`[Restore Verify] CRITICAL ERROR: Backup verification FAILED!`);
    console.error(`The backup file ${latestBackup} may be corrupted or invalid.`);
    console.error(error);
    process.exit(1);
  }
}

verifyLatestBackup();
