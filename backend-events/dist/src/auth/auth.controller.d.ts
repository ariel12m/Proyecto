import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            name: string;
            email: string;
            id: number;
            cedula: string | null;
            phone: string | null;
            address: string | null;
            licenseNumber: string | null;
            vehicle: string | null;
            createdAt: Date;
        };
    }>;
    register(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            name: string;
            email: string;
            id: number;
            cedula: string | null;
            phone: string | null;
            address: string | null;
            licenseNumber: string | null;
            vehicle: string | null;
            createdAt: Date;
        };
    }>;
}
