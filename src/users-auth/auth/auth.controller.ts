import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActivacionDTO } from './activacion.dto';
import { LoginDTO } from '../usuario/dto/login-dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('login') // Ruta para obtener todas las configuraciones registradas
  public async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO)
  }

  @Post('registrer')
  public async registrer(@Body() userDTO: CreateUsuarioDto) {
    await this.authService.registrer(userDTO)
    return { success: true }
  }

  @Post('cambiarContrasena/:idUsuario')
  public async cambiarContrasena(@Param('idUsuario') idUsuario: string, @Body() payload: { newContrasena: string, contrasenaAnterior?: string }) {
    await this.authService.cambiarContrasena(idUsuario, payload.newContrasena, payload.contrasenaAnterior)
    return { success: true }
  }

  @Post('enviarCodigoVerificacionIdentidad/:idUsuario')
  public async enviarCodigoVerificacionIdentidad(@Param('idUsuario') idUsuario: string) {
    await this.authService.enviarCorreoVerificacionIdentidad(idUsuario)
    return { success: true }
  }

  @Post('verificarCodigoIdentidad')
  public async verificarCodigoIdentidad(@Body() activacionDTO: ActivacionDTO) {
    await this.authService.verificarCodigoIdentidad(activacionDTO.idUsuario, activacionDTO.codigoActivacion)
    return { success: true }
  }

  @Post('activarCuentaUsuario')
  public async activarCuentaUsuario(@Body() activacionDTO: ActivacionDTO) {
    await this.authService.activarCuentaUsuario(activacionDTO.idUsuario, activacionDTO.codigoActivacion)
    return { success: true }
  }
}
