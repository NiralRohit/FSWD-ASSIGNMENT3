const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function backupFiles(sourceDir, backupDir) {
    try {
        if (!fs.existsSync(sourceDir)) {
            console.log('Source directory does not exist.');
            return;
        }

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const files = fs.readdirSync(sourceDir);
        let logData = '';

        files.forEach(file => {
            const sourcePath = path.join(sourceDir, file);
            const backupPath = path.join(backupDir, file);

            if (fs.lstatSync(sourcePath).isFile()) {
                fs.copyFileSync(sourcePath, backupPath);
                const stats = fs.statSync(backupPath);
                logData += `Copied: ${file} | Size: ${stats.size} bytes | Timestamp: ${new Date().toISOString()}\n`;
                console.log(`Backed up: ${file}`);
            }
        });

        fs.writeFileSync(path.join(backupDir, 'backup-log.txt'), logData);
        console.log('Backup completed successfully.');
    } catch (error) {
        console.error('Error during backup:', error.message);
    }
}

function zipBackup(backupDir) {
    try {
        const zipPath = `${backupDir}.zip`;
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Backup compressed into ${zipPath} (${archive.pointer()} bytes)`);
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        archive.directory(backupDir, false);
        archive.finalize();
    } catch (error) {
        console.error('Error during compression:', error.message);
    }
}

const sourceFolder = process.argv[2];
const backupFolder = 'backup';

backupFiles(sourceFolder, backupFolder);
zipBackup(backupFolder);