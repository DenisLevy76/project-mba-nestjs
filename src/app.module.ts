import { Module } from '@nestjs/common'

import { AuthModule } from './infra/auth/auth.module'
import { DatabaseModule } from './infra/database/database.module'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
