import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: any) {
    const newUser = await this.userService.create(createUserDto);
    const userWithoutPassword: any = { ...newUser };
    delete userWithoutPassword.password;
    return this.login(userWithoutPassword);
  }
}
