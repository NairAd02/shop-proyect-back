import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { SendEmailDTO } from './send-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {

    constructor(private configService: ConfigService) { }

    public async sendEmail(sendEmailDTO: SendEmailDTO) {
        // se obtiene el transporte
        const transport = this.createTransport()

        // se define la propiedad "from" del mensaje
        sendEmailDTO.from = {
            name: this.configService.get<string>('NAME_APP'),
            address: this.configService.get<string>('EMAIL_APP')
        }
        // se envia el email
        try {
            await transport.sendMail(sendEmailDTO)
        } catch (error) {
            throw new BadRequestException(error.message)
        }

    }

    private createTransport() {
        // se crea un transporte
        return nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: parseInt(this.configService.get<string>('MAIL_PORT')),
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        })
    }
}
