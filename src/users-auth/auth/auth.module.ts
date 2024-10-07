import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module';

import { CodigoActivacionModule } from '../codigo-activacion/codigo-activacion.module';
import { MailerModule } from '../mailer/mailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsuarioModule, JwtModule.registerAsync({
    imports: [ConfigModule], // Importa el ConfigModule
    inject: [ConfigService],  // Inyecta el ConfigService
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET_WORD'), // Obtiene la clave secreta de las variables de entorno
      signOptions: { expiresIn: '1d' }, // Se configura el tiempo de expiración
    }),
  }), CodigoActivacionModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
