import express from 'express';

const app = express();

console.log('> Starting...');

app.listen(process.env.PORT, () => {
    console.log(`> Server started on port ${process.env.PORT}`);
});