import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}
  create(createEventDto: CreateEventDto, userId: number) {
    return this.prisma.event.create({
      data: { ...createEventDto, userId },
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(id: number) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  findLatest(events: number) {
    return this.prisma.event.findMany({
      take: events,
      orderBy: { createdAt: 'desc' },
    });
  }

  countEvents() {
    return this.prisma.event.count();
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: { ...updateEventDto },
    });
  }

  remove(id: number) {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  async createFromESP32(eventDto: any, sensorData: any) {
    try {
      const event = await this.prisma.event.create({
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
