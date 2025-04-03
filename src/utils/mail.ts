import { transporter } from '@/configs/mailer';

const sendMail = async (to: string, subject: string, { text, html }: { text?: string, html?: string }): Promise<boolean> => {
    const info = await transporter.sendMail({
        from: 'nikolanedeljkovic.official@gmail.com',
        to,
        subject,
        text,
        html
    });
    if(info.accepted) return true;
    return false;
};

export const sendEmailVerificationCode = async (to: string, code: string): Promise<boolean> => {
    return sendMail(to, 'Verify your Email', {
        text: `Please verify your email by clicking on link below\nhttp://localhost:5173/${code}`
    });
};
