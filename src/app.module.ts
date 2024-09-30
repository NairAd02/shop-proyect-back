import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './users-auth/auth/auth.module';
import { UsuarioModule } from './users-auth/usuario/usuario.module';

@Module({
  imports: [ProductModule, ConfigModule.forRoot(
    {
      isGlobal: true
    }
  ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('DB_HOST')}:${configService.get<string>('DB_PORT')}/${configService.get<string>('DB_NAME')}`,
      }),
      inject: [ConfigService],
    }),
    ReviewModule,
    AuthModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
