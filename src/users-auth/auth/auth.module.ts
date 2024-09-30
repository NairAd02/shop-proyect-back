import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module';
import { jwtConstants } from '../utils/globals';
import { CodigoActivacionModule } from '../codigo-activacion/codigo-activacion.module';
import { MailerModule } from '../mailer/mailer.module';


@Module({
  imports: [UsuarioModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d' },
  }), CodigoActivacionModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
