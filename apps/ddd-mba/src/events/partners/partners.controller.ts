import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PartnerService } from '../../../src/@core/events/application/partner.service';

@Controller('partners')
export class PartnersController {
  constructor(private partnerService: PartnerService) {}
  @Get()
  list() {
    return this.partnerService.list();
  }

  @Post()
  create(@Body() body: { name: string }) {
    return this.partnerService.register(body);
  }

  @Put('/:partner_id')
  update(
    @Param('partner_id') partner_id: string,
    @Body() body: { name: string },
  ) {
    return this.partnerService.update(partner_id, body);
  }
}
