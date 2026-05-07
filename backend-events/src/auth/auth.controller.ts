import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('>>> Login attempt:', body.email);

    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    console.log('>>> User found:', user ? 'YES' : 'NO');

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    console.log('>>> Password valid:', isPasswordValid ? 'YES' : 'NO');

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password, ...userWithoutPassword } = user;
    const payload = { username: user.email, sub: user.id };

    console.log('>>> Login SUCCESS for:', body.email);

    return {
      token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    console.log('>>> Register attempt:', body.email);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      console.log('>>> Email already exists');
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    console.log('>>> User created:', newUser.id);

    const { password, ...userWithoutPassword } = newUser;
    const payload = { username: newUser.email, sub: newUser.id };

    return {
      token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
