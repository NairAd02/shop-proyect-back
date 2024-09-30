import { Controller, UseInterceptors, ClassSerializerInterceptor, Post, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FiltersUsuarioDTO } from './dto/filters-usuario.dto';
import { RolEnum } from './schemas/usuario.schema';


@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post('createUsuario')
  public async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    await this.usuarioService.create(createUsuarioDto);
    return { success: true }
  }

  @UseInterceptors(ClassSerializerInterceptor) // se indica que se usan interceptores para personalizar la serialización del objeto de retorno del método
  @Get('getAllUsers')
  public async findAll(@Query('nombreUsuario') nombreUsuario: string, @Query('email') email: string, @Query('rol') rol: RolEnum,
    @Query('idSolicitante') idSolicitante: string) {
    return await this.usuarioService.findAll(nombreUsuario, rol, email, idSolicitante)
  }

  @Get('getUsuarioById/:idUsuario')
  public async findOneById(@Param('idUsuario') idUsuario: string) {
    return await this.usuarioService.getProfileUser(idUsuario);
  }

  @Patch('updateUser/:idUsuario')
  public async update(@Param('idUsuario') idUsuario: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    await this.usuarioService.update(idUsuario, updateUsuarioDto)
    return { success: true }
  }

  @Delete('deleteUser/:idUsuario')
  public async delete(@Param('idUsuario') idUsuario: string) {
    await this.usuarioService.delete(idUsuario)
    return { success: true }
  }
}
