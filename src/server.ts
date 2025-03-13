import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.set('trust proxy', true);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

console.log('> Starting...');

app.listen(process.env.PORT, () => {
    console.log(`> Server started on port ${process.env.PORT}`);
});
