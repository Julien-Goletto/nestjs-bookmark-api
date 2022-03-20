import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://bookmarkAPI:bookmarkAPI2022@localhost:5434/bookmarkAPI?schema=public',
        },
      },
    });
  }
}
