import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorldRule } from './entities/world-rule.entity';
import { WorldRulesController } from './world-rules.controller';
import { WorldRulesService } from './world-rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorldRule])],
  controllers: [WorldRulesController],
  providers: [WorldRulesService],
})
export class WorldRulesModule {}
