import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

export const validateObjectIdParam = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: 'Id is required' });
        return;
    }
    if(!isValidObjectId(id)){
        res.status(400).json({ message: 'Id is not in valid format' });
        return;
    }
    next();
};
