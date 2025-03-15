import mongoose from 'mongoose';

export const connect = async (): Promise<void> => {
    const URI = process.env.MONGODB_URI;
    if (!URI)
        throw 'MONGODB_URI is not defined in ENV variables';

    await mongoose
        .connect(URI)
        .catch((err) => {
            throw 'MongoDB Not Connected: ' + err;
        });
};
