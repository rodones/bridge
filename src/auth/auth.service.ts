import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import argon2 from "argon2";
import { User } from "src/entities";
import { UserDetails } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
  ) {}

  async validateUser(username: string, password: string): Promise<Omit<User, "password">> {
    const user = await this.userRepo.findOneOrFail({
      username,
    });

    const passwordsMatch = await argon2.verify(user.password, password);
    if (!passwordsMatch) {
      throw new NotFoundException("Username found but passwords are not matching.");
    }

    return UserDetails.from(user);
  }

  async getUserById(id: number): Promise<Omit<User, "password">> {
    const user = await this.userRepo.findOneOrFail(id, {
      fields: ["id", "username"],
    });

    return user;
  }

  async getToken(user: Omit<User, "password">) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
