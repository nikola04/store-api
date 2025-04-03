import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PSWD
    }
});

export const verifySMTP = async (): Promise<void> => {
    try{
        await transporter.verify();
    }catch(err){
        throw 'SMTP Not Connected:' + err;
    }
};
