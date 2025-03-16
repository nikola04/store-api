import { Request, Response } from 'express';

export const refresh = (req: Request, res: Response): void => {
    console.log(req.cookies);
    res.send('ok');
};
