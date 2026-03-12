import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateWorldRuleDto } from './dto/create-world-rule.dto';
import { UpdateWorldRuleDto } from './dto/update-world-rule.dto';
import { WorldRulesService } from './world-rules.service';

@Controller('world-rules')
export class WorldRulesController {
  constructor(private readonly worldRulesService: WorldRulesService) {}

  @Post()
  create(@Body() createWorldRuleDto: CreateWorldRuleDto) {
    return this.worldRulesService.create(createWorldRuleDto);
  }

  @Get('/novels/:novelId')
  findByNovel(@Param('novelId', ParseUUIDPipe) novelId: string) {
    return this.worldRulesService.findByNovel(novelId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.worldRulesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorldRuleDto: UpdateWorldRuleDto,
  ) {
    return this.worldRulesService.update(id, updateWorldRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.worldRulesService.remove(id);
  }
}
