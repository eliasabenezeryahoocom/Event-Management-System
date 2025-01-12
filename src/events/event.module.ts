import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventSchema } from './schemas/event.schema';
import { UserModule } from 'src/users/user.module';
import { Ticket, TicketSchema } from 'src/tickets/schemas/ticket.schema';
import { TicketModule } from 'src/tickets/ticket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Event', schema: EventSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
    UserModule,
    TicketModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
