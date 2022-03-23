import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me') // Blank means it catches any route from the previous node
  getMe(@GetUser() user: User) {
    //Here we use the User type made by Prisma
    return user;
  }
}
