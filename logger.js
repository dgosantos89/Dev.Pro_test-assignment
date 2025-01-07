const { appendFile } = require('fs/promises');

async function logMessage(filename, message, level) {
    if (!filename || !message || !level) {
        console.error(`Invalid parameter provided ${filename}, ${message}, ${level}`);
        return;
    }

    // Transform ISO date on timestamp format
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;

    try {
        console.log('logEntry: ', logEntry);
        await appendFile(filename, logEntry);
    } catch (err) {
        console.error(`[${timestamp}] [ERROR] Error writing to log file: ${err.message}`);
    }
}

module.exports = logMessage;
