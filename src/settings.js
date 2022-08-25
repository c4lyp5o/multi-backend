import dotenv from 'dotenv';

dotenv.config();
export const welcomeMessage = process.env.WELCOME_MESSAGE;
