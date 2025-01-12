import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Ticket } from '../tickets/schemas/ticket.schema';
import { TicketService } from 'src/tickets/ticket.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private ticketService: TicketService,
    private userService: UserService,
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    const { title, date, description, ticketCapacity, invitees, location } =
      createEventDto;

    const createdEvent = new this.eventModel({
      title,
      date,
      description,
      ticketCapacity,
      invitees,
      location,
    });

    await createdEvent.save();

    const ticket = await this.ticketService.createTicket(
      createdEvent._id.toString(),
      ticketCapacity,
    );

    createdEvent.ticket = {
      capacity: ticket.ticketCapacity,
      eventId: ticket.eventId,
    };

    await createdEvent.save();

    return createdEvent;
  }

  async getUsersForEvent() {
    const users = await this.userService.getAllUsers(); // Fetch all users from the user service
    return users;
  }

  async acceptInvitation(eventId: string, userId: string): Promise<any> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (!event.invitees.includes(userId)) {
      throw new Error('User not invited');
    }

    event.attendees.push(userId);
    const index = event.invitees.indexOf(userId);
    event.invitees.splice(index, 1);
    await event.save();

    const ticket = await this.ticketService.findTicketByEventId(eventId);
    if (ticket.ticketCapacity <= ticket.ticketsIssued) {
      throw new Error('No more tickets available');
    }

    ticket.ticketsIssued += 1;
    await ticket.save();

    return { message: 'Invitation accepted', event };
  }

  async rejectInvitation(eventId: string, userId: string): Promise<any> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (!event.invitees.includes(userId)) {
      throw new Error('User not invited');
    }

    const index = event.invitees.indexOf(userId);
    event.invitees.splice(index, 1);
    await event.save();

    return { message: 'Invitation Unaccepted', event };
  }

  async getEventById(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  updateEvent(id: string, updateEventDto: UpdateEventDto) {
    return this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true });
  }

  async deleteEvent(id: string) {
    const event = await this.eventModel.findByIdAndDelete(id);

    if (!event) {
      throw new Error('Event not found');
    }

    return { message: 'Event deleted successfully' };
  }
}
