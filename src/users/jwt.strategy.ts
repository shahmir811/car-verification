import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersService } from './users.service';

// type UserObj{

// }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<Pick<User, 'id' | 'name' | 'email' | 'created_at'>> {
    const { id } = payload;
    const user = await this.usersService.findOne(id);
    const { password, ...rest } = user;

    if (!user) throw new UnauthorizedException();

    return rest;
  }
}
