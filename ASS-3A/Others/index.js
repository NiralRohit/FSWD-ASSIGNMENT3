const fs = require('fs');
const path = require('path');

const fileCategories = {
    Images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    Documents: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.ppt', '.pptx'],
    Videos: ['.mp4', '.mkv', '.avi', '.mov'],
    Others: []
};

function organizeDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            console.log('Directory does not exist. Please provide a valid path.');
            return;
        }

        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isFile()) {
                const ext = path.extname(file).toLowerCase();
                let folderName = 'Others';
                
                for (const category in fileCategories) {
                    if (fileCategories[category].includes(ext)) {
                        folderName = category;
                        break;
                    }
                }
                
                const folderPath = path.join(dirPath, folderName);
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }

                const newFilePath = path.join(folderPath, file);
                fs.renameSync(filePath, newFilePath);
                console.log(`Moved ${file} to ${folderName}`);
            }
        });

        console.log('Directory organized successfully!');
    } catch (error) {
        console.error('Error organizing directory:', error.message);
    }
}

const directoryPath = process.argv[2];
if (directoryPath) {
    organizeDirectory(directoryPath);
} else {
    console.log('Please provide a directory path.');
}