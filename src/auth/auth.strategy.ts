import { ExtractJwt, Strategy as PassportJwtStrategy } from "passport-jwt";
import { Strategy as PassportLocalStrategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { UnauthorizedException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./auth.dto";
import { User } from "src/entities";
import { ConfigService } from "@nestjs/config";
import { NotFoundError } from "@mikro-orm/core";

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("RODONES_BRIDGE_JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<Pick<User, "id">> {
    return { id: payload.sub };
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    try {
      return await this.authService.validateUser(username, password);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedException("Invalid username or password.");
      }

      throw error;
    }
  }
}
