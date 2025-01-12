import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('create')
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Patch('accept/:eventId')
  async acceptInvitation(
    @Param('eventId') eventId: string,
    @Body() body: { userId: string },
  ) {
    return this.eventService.acceptInvitation(eventId, body.userId); // Assume userId comes from request body
  }

  @Patch('reject/:eventId')
  async rejectInvitation(
    @Param('eventId') eventId: string,
    @Body() body: { userId: string },
  ) {
    return this.eventService.rejectInvitation(eventId, body.userId); // Reject invitation by userId
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return this.eventService.getEventById(id);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
