import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from '../../../src/@core/events/application/order.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/orders')
  async list() {
    return this.orderService.list();
  }

  @Post('/events/:event_id/orders')
  async create(
    @Param('event_id') event_id: string,
    @Body() body: CreateOrderDto,
  ) {
    return this.orderService.create({
      ...body,
      event_id,
    });
  }
}
