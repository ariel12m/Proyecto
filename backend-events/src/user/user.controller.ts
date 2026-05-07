import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  
  @Get()
  findAll() {
    return this.userService.findAll();
  }

/*   @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findOne(+email)
  } */

  
 @Get(':id')
findOne(@Param('id') id: string) {
  const userId = Number(id);
  if (isNaN(userId)) throw new BadRequestException('El id debe ser un número');
  return this.userService.findOne(userId);
}

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}