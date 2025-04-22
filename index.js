const fs = require('fs');
const os = require('os');
const path = require('path');

function inspectEnvironment() {
    try {
        const envDetails = {
            homeDirectory: os.homedir(),
            hostname: os.hostname(),
            networkInterfaces: os.networkInterfaces(),
            environmentVariables: process.env
        };

        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const filePath = path.join(logsDir, 'env-details.json');
        fs.writeFileSync(filePath, JSON.stringify(envDetails, null, 2));

        console.log('Environment details saved successfully in env-details.json');
    } catch (error) {
        console.error('Error while inspecting environment:', error.message);
    }
}

inspectEnvironment();