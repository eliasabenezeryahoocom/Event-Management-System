import { Controller, Post, Body } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { EventService } from 'src/events/event.service';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly eventService: EventService,
  ) {}

  @Post('create')
  async createTicket(@Body() createEventDto: CreateEventDto) {
    const { ticketCapacity } = createEventDto;

    const createdEvent = await this.eventService.createEvent(createEventDto);

    return this.ticketService.createTicket(
      createdEvent._id.toString(),
      ticketCapacity,
    );
  }
}
