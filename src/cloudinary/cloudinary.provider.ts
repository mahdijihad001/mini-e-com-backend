import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
// import { IEnv } from 'src/config/env.config';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {

        cloudinary.config({
            cloud_name: "",
            api_key: "",
            api_secret: "",
        });

        return cloudinary;
    },
};
