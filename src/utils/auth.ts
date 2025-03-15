import { CronJob } from 'cron';
import { Config, createAuthHandler, generateCredentials } from 'easy-token-auth';

export const authConfig: Config = {
    refresh_token: { expiry: 2592000 /* 30 days */ },
    access_token: { expiry: 1800 /* 30 minutes */ },
    credentials_limit: 5
};

export const authHandler = createAuthHandler(authConfig);

const generateAndSetCredentials = (): void => {
    console.log('> Generating new credentials...');
    const credentials = generateCredentials('ES384');
    authHandler.setCredentials(credentials);
};

CronJob.from({
    cronTime: '0 0 */7 * *',
    onTick: generateAndSetCredentials,
    start: true,
    timeZone: 'America/Los_Angeles'
});

generateAndSetCredentials();
