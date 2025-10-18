import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor( 
    private databaseService: DatabaseService,
    private jwtService: JwtService ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existing = await this.databaseService.user.findUnique({
      where: { email: registerAuthDto.email },
      
    });
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);
    const user = await this.databaseService.user.create({
      data: {
        email: registerAuthDto.email,
        name: registerAuthDto.username,
        password: hashedPassword,
      },
    });
    return { message: 'User registered successfully' };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: loginAuthDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
