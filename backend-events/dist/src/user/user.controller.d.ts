import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
    findOne(id: string): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
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
    updateProfile(id: string, updateProfileDto: UpdateProfileDto): import("@prisma/client").Prisma.Prisma__UserClient<{
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
    remove(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
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
