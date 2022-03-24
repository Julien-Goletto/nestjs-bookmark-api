import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable() // Decorator injectable is compulsary to put dependencies injections in classes
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([this.bookmark.deleteMany(), this.user.deleteMany()]);
    // By using transaction we ensure that bookmarks will be deleted first and avoid somme expected errors.
  }
}
