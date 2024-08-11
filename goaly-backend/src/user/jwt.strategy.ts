import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UserService } from './user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log(payload, '<<<<<<PAYLOAD');
    console.log(this.configService.get('jwt.secret'), '<<<<<<<<JWT SECRET');
    const { username } = payload;
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
