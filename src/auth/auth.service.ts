import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);
    //save the new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // return the saved user
      delete user.hash; //Temporary way of scrapping it out
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          //error code specific to duplicating unique object request
          throw new ForbiddenException('Credentials already taken');
        }
        throw error;
      }
    }
  }

  signin() {
    return { msg: 'I am signed in.' };
  }
}
