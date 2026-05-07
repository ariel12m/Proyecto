import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { EventService } from './event/event.service';
import { EventController } from './event/event.controller';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' }
      })
    }),
    EventModule
  ],
  controllers: [AuthController, UserController, EventController],
  providers: [
    PrismaService,
    AuthService,
    JwtStrategy,
    UserService,
    EventService,
  ]
})
export class AppModule {}
