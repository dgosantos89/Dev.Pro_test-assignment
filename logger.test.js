const { appendFile } = require('fs/promises');
const logMessage = require('./logger');

// Mock appendFile function
jest.mock('fs/promises', () => ({
    appendFile: jest.fn(),
}));

describe('logMessage function', () => {
    // Clear mock before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should write a valid INFO log entry to the file', async () => {
        await logMessage('application.log', 'User logged in', 'INFO');

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        const expectedLogEntry = `[${timestamp}] [INFO] User logged in\n`;

        expect(appendFile).toHaveBeenCalledWith('application.log', expect.stringContaining(expectedLogEntry));
    });

    test('should write a valid WARNING log entry to the file', async () => {
        await logMessage('application.log', 'Failed login attempt', 'WARNING');

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        const expectedLogEntry = `[${timestamp}] [WARNING] Failed login attempt\n`;

        expect(appendFile).toHaveBeenCalledWith('application.log', expect.stringContaining(expectedLogEntry));
    });

    test('should write a valid ERROR log entry to the file', async () => {
        await logMessage('application.log', 'Internal server error', 'ERROR');

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        const expectedLogEntry = `[${timestamp}] [ERROR] Internal server error\n`;

        expect(appendFile).toHaveBeenCalledWith('application.log', expect.stringContaining(expectedLogEntry));
    });

    test('should throw an error if parameters are missing', async () => {
        console.error = jest.fn();

        await logMessage('', 'User logged in', 'INFO');
        await logMessage('application.log', '', 'INFO');
        await logMessage('application.log', 'User logged in', '');

        expect(console.error).toHaveBeenCalledTimes(3);
        expect(appendFile).not.toHaveBeenCalled();
    });

    test('should handle errors when writing to the file', async () => {
        console.error = jest.fn();
        appendFile.mockRejectedValueOnce(new Error('Generic Error'));

        await logMessage('application.log', 'Critical error occurred', 'ERROR');

        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        expect(console.error).toHaveBeenCalledWith(
            `[${timestamp}] [ERROR] Error writing to log file: Generic Error`
        );
    });
});
