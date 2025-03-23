declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'testing';
        SERVER_DOMAIN: string;
        PORT: string;
        MONGODB_URI: string;
        ALLOWED_ORIGINS: string;
        STEAM_API_KEY: string;
    }
}
