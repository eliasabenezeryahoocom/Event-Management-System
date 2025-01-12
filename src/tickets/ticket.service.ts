import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './schemas/ticket.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
  ) {}

  async createTicket(eventId: string, ticketCapacity: number): Promise<Ticket> {
    const ticket = new this.ticketModel({
      eventId,
      ticketCapacity,
      ticketsIssued: 0,
      status: 'available',
    });

    return await ticket.save();
  }

  async findTicketByEventId(eventId: string): Promise<Ticket | null> {
    return this.ticketModel.findOne({ eventId });
  }

  async acceptInvitation(eventId: string): Promise<Ticket | null> {
    const ticket = await this.findTicketByEventId(eventId);
    if (!ticket) {
      throw new Error('Ticket not found for this event');
    }

    if (ticket.ticketCapacity <= ticket.ticketsIssued) {
      throw new Error('No more tickets available');
    }

    ticket.ticketsIssued += 1;
    await ticket.save();

    return ticket;
  }

  async rejectInvitation(eventId: string): Promise<Ticket | null> {
    const ticket = await this.findTicketByEventId(eventId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  }
}
