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
        uri: `mongodb+srv://${configService.get<string>('DB_USER')}:${configService.get<string>('DB_PASS')}@cluster0.la1wg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/${configService.get<string>('DB_NAME')}`
      }),
      inject: [ConfigService],
    }),
    ReviewModule,
    AuthModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
