import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Headers } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventService.create(createEventDto, req.user.id);
  }

  @Post('esp32/somnolencia')
  async crearSomnolenciaESP32(
    @Body() somnolenciaDto: any,
    @Headers('x-api-key') apiKey: string,
  ) {
    // Validar API Key
    if (apiKey !== process.env.ESP32_API_KEY) {
      return { error: 'API Key inválida' };
    }

    const eventDto = {
      title: somnolenciaDto.alerta === 1 ? 'ALERTA: Somnolencia' : 'Monitor activo',
      description: `Aceleración Y: ${somnolenciaDto.aceleracionY}`,
    };

    return this.eventService.createFromESP32(eventDto, somnolenciaDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}