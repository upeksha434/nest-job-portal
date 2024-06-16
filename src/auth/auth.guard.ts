import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import {ExtractJwt } from 'passport-jwt';
import { jwt_config } from 'src/config/jwt';

export class AuthGuard extends AuthGuardPassport('jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:  jwt_config.secret,
    });
  }

  async validate(payload: any) {
    /// VALIDATE YOUR USER

    return {
      id: payload.sub,
      email: payload.email,
      expired: payload.exp,
    };
  }


  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}