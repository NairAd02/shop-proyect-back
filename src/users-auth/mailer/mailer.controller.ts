import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDTO } from './send-email.dto';


@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) { }

  @Post('sendEmail')
  public async sendEmail(@Body() sendEmailDTO: SendEmailDTO) {
    await this.mailerService.sendEmail(sendEmailDTO)
    return { success: true }
  }
}
