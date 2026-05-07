import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
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
    login(user: any): Promise<{
        token: string;
        user: any;
    }>;
    register(createUserDto: any): Promise<{
        token: string;
        user: any;
    }>;
}
