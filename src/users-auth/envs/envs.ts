import * as dotenv from 'dotenv';


dotenv.config();

interface EnvVars {
    PORT: string
    NAME_DB: string
    SECRET_WORD: string
    MAIL_HOST: string
    MAIL_PORT: string
    MAIL_USER: string
    MAIL_PASSWORD: string
    NAME_APP: string
    EMAIL_APP: string
    EXPIRATION_TIME: string
}

export const envs: EnvVars = {
    PORT: process.env.PORT,
    NAME_DB: process.env.NAME_DB,
    SECRET_WORD: process.env.SECRET_WORD,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    NAME_APP: process.env.NAME_APP,
    EMAIL_APP: process.env.EMAIL_APP,
    EXPIRATION_TIME: process.env.EXPIRATION_TIME
}