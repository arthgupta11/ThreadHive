import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { db, users } from 'database-service/dist';
import { eq } from 'drizzle-orm';
import { AuthResponse, Payload } from './auth-response.dto';
import { UserResponseDto } from '../users/dtos/response.dto';

@Injectable()
export class AuthDao {
  constructor (private readonly jwtService: JwtService) {}

  async validateUser (
    email: string,
    password: string
  ): Promise<UserResponseDto | undefined> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user && (await bcrypt.compare(password, user[0].password))) {
      const { ...result } = user[0];
      return result;
    }
    return undefined;
  }

  async login (user: UserResponseDto): Promise<AuthResponse> {
    const payload: Payload = {
      email: user.email,
      role: user.role,
      sub: user.id.toString(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      payload,
    };
  }

  async logUserIn (email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const response = await this.login(user);
      console.log(response);
      return response;
    } catch (error) {
      console.log('error->', error);
      throw new Error('Loginn failed !');
    }
  }
}
