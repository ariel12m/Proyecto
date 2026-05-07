import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    create(createEventDto: CreateEventDto, req: any): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    crearSomnolenciaESP32(somnolenciaDto: any, apiKey: string): Promise<{
        success: boolean;
        id: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        id?: undefined;
    } | {
        error: string;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateEventDto: UpdateEventDto): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__EventClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string | null;
        date: Date | null;
        sensorData: import("@prisma/client/runtime/client").JsonValue | null;
        userId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
