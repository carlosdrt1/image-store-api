import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImagesModule } from './modules/images/images.module';
import { validationConfigSchema } from './config/validation-schema.config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ImagesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationConfigSchema,
    }),
  ],
})
export class AppModule {}
