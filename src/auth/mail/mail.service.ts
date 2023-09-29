import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmation(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Nest Gym! Confirm you Email!',
      template: './confirmation',
      context: {
        fullName,
        otp,
      },
    });
  }
}
