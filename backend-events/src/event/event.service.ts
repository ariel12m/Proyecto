import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly eventService: PrismaService) {}
  create(createEventDto: CreateEventDto, userId: number) {
    return this.eventService.event.create({
      data: { ...createEventDto, userId }
    })
  }

  findAll() {
    return this.eventService.event.findMany();
  }

  findOne(id: number) {
    return this.eventService.event.findUnique({
      where: {id}
    })
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventService.event.update({
      where: {id},
      data: {...updateEventDto}
    })
  }

  remove(id: number) {
    return this.eventService.event.delete({
      where: {id}
    })
  }

  async createFromESP32(eventDto: any, sensorData: any) {
    try {
      const event = await this.eventService.event.create({
        data: {
          title: eventDto.title,
          description: eventDto.description,
          sensorData: sensorData,
          userId: 1,
        },
      });
      return { success: true, id: event.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
