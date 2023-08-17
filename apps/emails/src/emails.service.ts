import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsService {
  async sendWelcomeToPartner(payload: any): Promise<void> {
    console.log(`Partner welcome email sended to "${payload.name}"`);
  }
}
