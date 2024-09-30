import { Address } from "nodemailer/lib/mailer"


export class SendEmailDTO {
    from?: Address // sender address
    to: Array<Address> // list of receivers
    subject: string // Subject line
    text: string // plain text body
    html: string // html body

    constructor(
        to: Array<Address>,
        subject: string,
        text: string,
        html: string,
        from?: Address) {
        this.to = to
        this.subject = subject
        this.text = text
        this.html = html
        this.from = from
    }
}