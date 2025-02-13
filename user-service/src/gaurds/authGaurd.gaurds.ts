import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db, users, usersChannelMapping } from 'database-service-arth/dist';
import { and, eq } from 'drizzle-orm';

import { AuthGaurdContextDto, DecodedTokenDto } from './authGuardContext.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly jwtService: JwtService // Inject JwtService to verify token
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    // const requested_service = context.args[3].fieldName

    const request: AuthGaurdContextDto = context.getArgs()[2];

    const token = request.req.raw?.headers.authorization;
    const { fieldName } = context.getArgs()[3];
    // Check if the token is provided
    if (fieldName === 'login') {
      request.activityDone = fieldName;
      return true;
    }
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Extract the JWT payload (email and roles)

      const decodedToken: DecodedTokenDto = this.jwtService.verify(token);
      console.log('decoded token: ', decodedToken);
      const { email } = decodedToken;
      const { role } = decodedToken;
      const id: bigint = decodedToken.sub;
      // Query the database to check if the email and roles exist in the users table
      const user = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.role, role)));

      if (!user) {
        throw new UnauthorizedException('Invalid email or roles');
      }

      // Attach user information to the request object (for use in other guards or controllers)
      request.email = email;
      request.role = role;
      request.userId = id;
      request.activityDone = fieldName;

      const getChannelIds = (data: { channelId: bigint }[]) => {
        return data.map(({ channelId }) => {
          return channelId;
        });
      };

      // write logic to extract list of channels he have accessed to admin
      if (role === 'ADMIN') {
        const channelsAccess = await db
          .select()
          .from(usersChannelMapping)
          .where(eq(usersChannelMapping.userId, id));
        request.channels = getChannelIds(channelsAccess);
      }
      // console.log("context req",context.a)
      return true; // Allow access if the user is found and roles match
    } catch (error) {
      throw new UnauthorizedException(`Invalid or expired token -> ${error}`);
    }
  }
}
