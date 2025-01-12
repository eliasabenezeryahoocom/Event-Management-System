import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  ticketCapacity: number;

  @Prop({ type: [String], default: [] })
  invitees: string[];

  @Prop({ type: [String], default: [] })
  attendees: string[];

  @Prop({
    type: Object,
    required: true,
    default: {
      capacity: 0,
      eventId: '',
    },
  })
  ticket: {
    capacity: number;
    eventId: string;
  };

  @Prop({ required: true })
  location: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
