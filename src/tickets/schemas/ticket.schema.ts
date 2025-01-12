import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ticket extends Document {
  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  ticketCapacity: number;

  @Prop({ default: 0 })
  ticketsIssued: number;

  @Prop({ default: 'available' })
  status: string; 

  @Prop({ type: [{ type: String, ref: 'User' }] })
  attendees: string[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
