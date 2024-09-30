import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RolEnum, Usuario } from './schemas/usuario.schema';

import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { FiltersUsuarioDTO } from './dto/filters-usuario.dto';
import { UsuarioSerializable } from './dto/usuario.serializable';
@Injectable()
export class UsuarioService {
  constructor(@InjectModel(Usuario.name) private usuariosModel: Model<Usuario>) { }

  public async create(createUsuarioDto: CreateUsuarioDto) {
    // se encripta la contraseña
    createUsuarioDto.contrasena = await bcrypt.hash(createUsuarioDto.contrasena, 10)
    // por defecto la cuenta del usuario se marca como "no activa"
    createUsuarioDto.isActiva = false
    const usuario = new this.usuariosModel(createUsuarioDto) // se crea un usuario  basado en la información del usuario dto
    // se verifica que no exista un usuario con el mismo nombre o email

    if (await this.findOne(undefined, undefined, undefined, createUsuarioDto.email)) // se existe un usuario con el mismo email
      throw new HttpException("Ya este email tiene asociado una cuenta", HttpStatus.BAD_REQUEST)
    if (await this.findOne(undefined, createUsuarioDto.nombreUsuario))
      throw new HttpException("Ya el nombre usuario está siendo usado", HttpStatus.BAD_REQUEST)

    await usuario.save() // se almacena al usuario en la base de datos
  }

  public async findAll(nombre?: String, rol?: RolEnum, email?: String, idSolicitante?: String): Promise<Array<UsuarioSerializable>> {
    const usuariosSerializables: Array<UsuarioSerializable> = new Array<UsuarioSerializable>()
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los usuarios
    const filters: FiltersUsuarioDTO = new FiltersUsuarioDTO(undefined, nombre ? { $regex: nombre.toString(), $options: 'i' } : undefined, email, rol)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obtiene la list ade usuarios
    const usuarios = await this.usuariosModel.find(filters).exec();
    // se crean objetos serializables para los usuario y se filtra el id del solicitante
    usuarios.forEach((usuario) => {
      // si el filtro de "idSolicitante" no tiene valor o si el id del solicitante es distinto del is del usuario a serializar si no es distinto, entonces no se incluye en la serialización
      // y el rol del usuario sea distinto de "Súper Administrador" ya que el usuario del Súper Administrador no debe de ser expuesto
      if ((!idSolicitante || usuario._id.toString() !== idSolicitante) && usuario.rol !== RolEnum.SuperAdministrador)
        usuariosSerializables.push(new UsuarioSerializable(usuario._id.toString(), usuario.nombreUsuario, usuario.email, usuario.rol))
    })
    return usuariosSerializables
  }

  public async findOne(id: string, nombre?: String, rol?: RolEnum, email?: String): Promise<Document<unknown, {}, Usuario> & Usuario & {
    _id: Types.ObjectId;
  }> {
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los usuarios
    const filters: FiltersUsuarioDTO = new FiltersUsuarioDTO(id, nombre, email, rol)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    return await this.usuariosModel.findOne(filters).exec()
  }

  public async findOneSerializable(id: string, nombre?: String, rol?: RolEnum, email?: String): Promise<UsuarioSerializable> {
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los usuarios
    const filters: FiltersUsuarioDTO = new FiltersUsuarioDTO(id, nombre, email, rol)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    // se obitene el usuario de la base de datos
    const usuario = await this.usuariosModel.findOne(filters).exec()
    // si fue encontrado el usuario
    if (usuario)
      return new UsuarioSerializable(usuario._id.toString(), usuario.nombreUsuario, usuario.email, usuario.rol)
    else
      throw new HttpException("No existe esta cuenta", HttpStatus.BAD_REQUEST)
  }

  public async getProfileUser(id: string): Promise<UsuarioSerializable> {
    const usuario = await this.usuariosModel.findById(id) // se obtiene la infomración del usuario con ese id

    // si fue encontrado un usuario con ese id
    if (usuario)
      return new UsuarioSerializable(usuario._id.toString(), usuario.nombreUsuario, usuario.email, usuario.rol)
    else
      throw new HttpException("No existe un usuario con ese id", HttpStatus.BAD_REQUEST)
  }

  // Método para actualizar la información de un usuario
  public async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    // se encuentra al usuario con ese id
    const usuario = await this.findOne(id)
    if (usuario) { // si fue encontrado un usuario con ese id
      // se actualizan los campos del usuario
      if (updateUsuarioDto.nombreUsuario) { // si fue proporcionado un nombre de usuario nuevo
        // se comprueba que no existe un usuario con el mismo nombre de usuario
        const usuarioExistente = await this.findOne(undefined, updateUsuarioDto.nombreUsuario)
        // si no existe un usuario con es nombre de usuario o si el que existe es el mismo
        if (!usuarioExistente || usuarioExistente._id.toString() === id)
          usuario.nombreUsuario = updateUsuarioDto.nombreUsuario
        else
          throw new HttpException("Ya el nombre usuario está siendo usado", HttpStatus.BAD_REQUEST)
      }
      if (updateUsuarioDto.contrasena) { // si fue proporcionada una contraseña nueva
        // se encripta la contraseña antes de asignarla
        usuario.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, 10)
      }

      if (updateUsuarioDto.rol) // si fue proporcionado un rol nuevo
        usuario.rol = updateUsuarioDto.rol

      await usuario.save() // se guardan los cambios en la base de datos
    }
    else
      throw new HttpException("No existe un usuario con ese id", HttpStatus.BAD_REQUEST)

  }

  // Método para verificar si una contraseña pertenece o no a un usuario en específico
  public async verificarContraseñaUsuario(contrasena: string, idUsuario: string): Promise<boolean> {
    // se busca primero al usuario
    let isContrasenaPerteneceUsuario = false
    const usuario = await this.findOne(idUsuario)

    // si fue entontrado a un usuario con ese id
    if (usuario) {
      // se realiza la comprobación de la contraseña
      if (await bcrypt.compare(contrasena, usuario.contrasena.toString())) // si las contraseñas son iguales
        isContrasenaPerteneceUsuario = true // se indica que la contraseña si pertenece al usuario
    }
    else
      throw new HttpException("No existe un usuario con ese id", HttpStatus.BAD_REQUEST)

    return isContrasenaPerteneceUsuario
  }

  // Método para eliminar un usuario en específico
  public async delete(id: string) {
    await this.usuariosModel.deleteOne({ _id: id }).exec()
  }
}
