import { Controller, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteUserDto } from 'src/auth/dto/delete-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec(); // Fetch all users from the database
  }

  @Delete('delete')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return this.userService.deleteUser(deleteUserDto);
  }
}
