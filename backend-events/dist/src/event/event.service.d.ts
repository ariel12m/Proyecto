import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class EventService {
    private readonly eventService;
    constructor(eventService: PrismaService);
    create(createEventDto: CreateEventDto, userId: number): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateEventDto: UpdateEventDto): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    createFromESP32(eventDto: any, sensorData: any): Promise<{
        success: boolean;
        id: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        id?: undefined;
    }>;
}
