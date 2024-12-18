import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AuthModule } from './infra/auth/auth.module'
import { DatabaseModule } from './infra/database/database.module'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
