import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        email: string;
        password: string;
        id: number;
        cedula: string | null;
        phone: string | null;
        address: string | null;
        licenseNumber: string | null;
        vehicle: string | null;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(createUserDto: CreateUserDto): Promise<{
        name: string;
        email: string;
        password: string;
        id: number;
        cedula: string | null;
        phone: string | null;
        address: string | null;
        licenseNumber: string | null;
        vehicle: string | null;
        createdAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        events: {
            id: number;
            createdAt: Date;
            title: string;
            description: string | null;
            date: Date | null;
            sensorData: import("@prisma/client/runtime/client").JsonValue | null;
            userId: number;
        }[];
    } & {
        name: string;
        email: string;
        password: string;
        id: number;
        cedula: string | null;
        phone: string | null;
        address: string | null;
        licenseNumber: string | null;
        vehicle: string | null;
        createdAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        events: {
            id: number;
            createdAt: Date;
            title: string;
            description: string | null;
            date: Date | null;
            sensorData: import("@prisma/client/runtime/client").JsonValue | null;
            userId: number;
        }[];
        name: string;
        email: string;
        id: number;
        cedula: string | null;
        phone: string | null;
        address: string | null;
        licenseNumber: string | null;
        vehicle: string | null;
        createdAt: Date;
    } | null>;
    update(id: number, updateUserDto: UpdateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        email: string;
        password: string;
        id: number;
        cedula: string | null;
        phone: string | null;
        address: string | null;
        licenseNumber: string | null;
        vehicle: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateProfile(id: number, updateProfileDto: UpdateProfileDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        email: string;
        password: string;
        id: number;
        cedula: string | null;
        phone: string | null;
        address: string | null;
        licenseNumber: string | null;
        vehicle: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        email: string;
        password: string;
        id: number;
        cedula: string | null;
        phone: string | null;
        address: string | null;
        licenseNumber: string | null;
        vehicle: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
