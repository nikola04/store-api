import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from 'cookie-parser';
import { getAllowedOrigins } from './utils/cors';
import { extractHeaders } from './middlewares/headers';
import { connect } from './configs/database';

const app = express();

app.set('trust proxy', true);

const origins = getAllowedOrigins();
app.use(cors({
    origin: origins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(extractHeaders({ device: true, authorization: true })); // when modified, modify types in express.d.ts
app.use('/', routes);

const startServer = async (): Promise<void> => {
    console.log('> Starting server...');
    try {
        await connect().then(() => console.log('> Database conected successfully.'));
        if(!process.env.PORT) throw 'PORT is not defined in ENV variables.';
        app.listen(process.env.PORT, () => console.log('> Server is listening on', `\x1b[34mhttp://localhost:${process.env.PORT}/\x1b[0m`));
    } catch (error) {
        console.error('❌', error);
        process.exit(1);
    }
};

startServer();
