import { registerAs } from '@nestjs/config';

export interface IEnv {
    NODE_ENV: string;
    PORT: number;
    API_PREFIX: string;
    APP_URL: string;

    DATABASE: {
        DATABASE_URL: string
        DATABASE_POOL_MAX: number,
        DATABASE_POOL_MIN: number
    };

    JWT: {
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        JWT_REFRESH_SECRET: string;
        JWT_REFRESH_EXPIRES_IN: string;
    };

    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_API_KEY: string,
        CLOUDINARY_API_SECRET: string
    }

}

const requiredEnv = [
    "NODE_ENV",
    "PORT",
    "API_PREFIX",
    "APP_URL",
    "DATABASE_URL",
    "DATABASE_POOL_MIN",
    "DATABASE_POOL_MAX",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];
// env Checker
function envChecker() {
    requiredEnv.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required env: ${key}`);
        }
    });
}

export default registerAs('env', (): IEnv => {
    envChecker();

    return {

        NODE_ENV: process.env.NODE_ENV!,
        PORT: Number(process.env.PORT!),
        API_PREFIX: process.env.API_PREFIX!,
        APP_URL: process.env.APP_URL!,

        DATABASE: {
            DATABASE_URL: process.env.DATABASE_URL!,
            DATABASE_POOL_MAX: Number(process.env.DATABASE_POOL_MAX!),
            DATABASE_POOL_MIN: Number(process.env.DATABASE_POOL_MIN!)
        },

        JWT: {
            JWT_SECRET: process.env.JWT_SECRET!,
            JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
            JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
        }

    };
});
