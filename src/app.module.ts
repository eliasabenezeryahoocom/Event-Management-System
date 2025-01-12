import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';  
import { UserModule } from './users/user.module';
import { EventModule } from './events/event.module';
import { TicketModule } from './tickets/ticket.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    MongooseModule.forRoot(process.env.MONGO_URI),  
    JwtModule.register({
      secret: process.env.JWT_SECRET,  
      signOptions: { expiresIn: '1h' },  
    }),
    AuthModule,
    UserModule, 
    EventModule,
    TicketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
