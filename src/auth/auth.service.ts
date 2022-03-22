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

  async signin(dto: AuthDto) {
    // We reach for a user defined by his unique email address
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // Tests
    // 1 - The user exists / or not
    if (!user) throw new ForbiddenException('Credentials incorrect.');
    // 2 - The password corresponds with the hash / or not
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect.');
    // Returning the user without the hash
    delete user.hash;
    return user;
  }
}
