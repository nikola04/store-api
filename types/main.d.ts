declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'testing';
        ALLOWED_ORIGINS: string;
        PORT: string;
        MONGODB_URI: string;
    }
}
